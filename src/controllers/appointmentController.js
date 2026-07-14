const prisma = require("../config/prisma");
const { withDbRetry } = require("../utils/db");

const {
    acquireLock,
    releaseLock
} = require("../utils/redisLock");


const { publishEvent } = require("../utils/kafkaProducer");
const Topics = require("../utils/kafkaTopics");

function normalizeAppointmentDate(appointmentDate) {
    if (appointmentDate instanceof Date) {
        return new Date(appointmentDate);
    }

    const parsed = new Date(appointmentDate);

    if (!Number.isNaN(parsed.getTime())) {
        return parsed;
    }

    const fallback = new Date(`${appointmentDate}T00:00:00`);

    if (!Number.isNaN(fallback.getTime())) {
        return fallback;
    }

    throw new Error("Invalid appointment date");
}

function buildSlotDateTime(appointmentDate, slotStartTime) {
    const baseDate = normalizeAppointmentDate(appointmentDate);
    const [hours = 0, minutes = 0] = (slotStartTime || "00:00")
        .split(":")
        .map((part) => Number.parseInt(part, 10));

    return new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        hours,
        minutes,
        0,
        0
    );
}

function buildSlotEndTime(appointmentDate, slotStartTime, durationMins = 30) {
    const startTime = buildSlotDateTime(appointmentDate, slotStartTime);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + Number(durationMins || 30));
    return endTime;
}



/* =====================================================
   BOOK APPOINTMENT
===================================================== */

exports.bookAppointment = async (req, res, next) => {

    try {

        const {
            doctorId,
            appointmentDate,
            slotStartTime,
            symptoms: incomingSymptoms,
            urgency
        } = req.body;

        // Use `symptoms` as the single source of truth for patient complaints
        const symptoms = (incomingSymptoms || "").toString().trim();

        // Patient
        const patient = await withDbRetry(() => prisma.patient.findUnique({
            where: { userId: req.user.id },
            include: { user: true }
        }));

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found." });
        }

        // Doctor
        const doctor = await withDbRetry(() => prisma.doctor.findUnique({
            where: { id: doctorId },
            include: { user: true }
        }));

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        // Check Doctor Leave
        const leave = await withDbRetry(() => prisma.doctorLeave.findFirst({
            where: {
                doctorId,
                leaveDate: new Date(appointmentDate)
            }
        }));

        if (leave) {
            return res.status(400).json({ success: false, message: "Doctor is on leave." });
        }

        // Distributed Lock
        const lockKey = `lock:${doctorId}:${appointmentDate}:${slotStartTime}`;
        const locked = await acquireLock(lockKey);

        if (!locked) {
            return res.status(409).json({ success: false, message: "Slot is currently being booked by another user." });
        }

        try {
            // Double Check DB
            const existingAppointment = await withDbRetry(() => prisma.appointment.findUnique({
                where: {
                    doctorId_appointmentDate_slotStartTime: {
                        doctorId,
                        appointmentDate: new Date(appointmentDate),
                        slotStartTime
                    }
                }
            }));

            if (existingAppointment) {
                return res.status(409).json({ success: false, message: "Slot already booked." });
            }

            // Transaction
            const appointment = await prisma.$transaction(async (tx) => {
                return await tx.appointment.create({
                    data: {
                        patientId: patient.id,
                        doctorId,
                        appointmentDate: new Date(appointmentDate),
                        slotStartTime,
                        symptoms: symptoms || null,
                        urgencyLevel: urgency || null,
                        status: "BOOKED"
                    }
                });
            });

            const bookingStartTime = buildSlotDateTime(appointmentDate, slotStartTime);
            const bookingEndTime = buildSlotEndTime(appointmentDate, slotStartTime, doctor.slotDurationMins || 30);

            const eventPayload = {
                appointmentId: appointment.id,
                patientId: patient.id,
                patientName: patient.user?.name || req.user.name || "Patient",
                patientEmail: patient.user?.email || req.user.email,
                doctorId,
                doctorName: doctor.user?.name || "Doctor",
                doctorEmail: doctor.user?.email,
                appointmentDate,
                slotStartTime,
                slotEndTime: bookingEndTime,
                startTime: bookingStartTime,
                endTime: bookingEndTime
            };

            console.log("Publishing appointment.booked", eventPayload);

            try {
                await publishEvent(Topics.APPOINTMENT_BOOKED, eventPayload);
            } catch (publishError) {
                console.warn("Appointment booking event publish failed", publishError.message || publishError);
            }

                try {
                    const llmPayload = {
                        appointmentId: appointment.id,
                        patientId: patient.id,
                        patientName: patient.user?.name || req.user.name || "Patient",
                        patientEmail: patient.user?.email || req.user.email,
                        age: patient.age ?? null,
                        gender: patient.gender ?? null,
                        bloodGroup: patient.bloodGroup || null,
                        symptoms: appointment.symptoms || "Booking created. No symptoms submitted yet.",
                        urgencyLevel: appointment.urgencyLevel || urgency || null,
                        doctorId: doctor.id,
                        doctorName: doctor.user?.name,
                        doctorEmail: doctor.user?.email,
                        specialization: doctor.specialization || null,
                        appointmentDate: appointment.appointmentDate,
                        slotStartTime: appointment.slotStartTime
                    };
                    console.log('Publishing symptoms.submitted', llmPayload);
                    await publishEvent(Topics.SYMPTOMS_SUBMITTED, llmPayload);
                } catch (publishError) {
                    console.warn("LLM pre-summary event publish failed", publishError.message || publishError);
                }

            res.status(201).json({ success: true, message: "Appointment booked successfully.", data: appointment });

        } finally {
            await releaseLock(lockKey);
        }

    } catch (err) {
        next(err);
    }
};



/* =====================================================
   CANCEL APPOINTMENT
===================================================== */

exports.cancelAppointment = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;

        const patient = await prisma.patient.findUnique({

            where: {

                userId: req.user.id

            }

        });

        const appointment =
            await prisma.appointment.findUnique({

                where: {

                    id: appointmentId

                }

            });

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message: "Appointment not found."

            });

        }

        if (appointment.patientId !== patient.id) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        const updatedAppointment =
            await prisma.appointment.update({

                where: {

                    id: appointmentId

                },

                data: {

                    status: "CANCELLED"

                }

            });

        const eventPayload = {
            appointmentId,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            patientName: req.user.name || "Patient",
            doctorName: "Doctor",
            patientEmail: req.user.email,
            appointmentDate: appointment.appointmentDate,
            slotStartTime: appointment.slotStartTime,
            slotEndTime: appointment.slotStartTime
        };

        try {
            console.log('Publishing appointment.cancelled', eventPayload);
            await publishEvent(Topics.APPOINTMENT_CANCELLED, eventPayload);
        } catch (publishError) {
            console.warn("Appointment cancellation event publish failed", publishError.message || publishError);
        }

        res.status(200).json({

            success: true,

            message: "Appointment cancelled.",

            data: updatedAppointment

        });

    }

    catch (err) {

        next(err);

    }

};



/* =====================================================
   RESCHEDULE APPOINTMENT
===================================================== */

exports.rescheduleAppointment = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;

        const {

            appointmentDate,

            slotStartTime

        } = req.body;

        const patient = await prisma.patient.findUnique({

            where: {

                userId: req.user.id

            }

        });

        const appointment =
            await prisma.appointment.findUnique({

                where: {

                    id: appointmentId

                }

            });

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message: "Appointment not found."

            });

        }

        if (appointment.patientId !== patient.id) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        const lockKey =
            `lock:${appointment.doctorId}:${appointmentDate}:${slotStartTime}`;

        const locked =
            await acquireLock(lockKey);

        if (!locked) {

            return res.status(409).json({

                success: false,

                message: "Slot is currently unavailable."

            });

        }

        try {

            const existing =
                await withDbRetry(() => prisma.appointment.findUnique({

                    where: {

                        doctorId_appointmentDate_slotStartTime: {

                            doctorId: appointment.doctorId,

                            appointmentDate:
                                new Date(appointmentDate),

                            slotStartTime

                        }

                    }

                }));

            if (existing) {

                return res.status(409).json({

                    success: false,

                    message: "Requested slot already booked."

                });

            }

            const updatedAppointment =
                await withDbRetry(() => prisma.appointment.update({

                    where: {

                        id: appointmentId

                    },

                    data: {

                        appointmentDate:
                            new Date(appointmentDate),

                        slotStartTime

                    }

                }));

            const rescheduleStartTime = buildSlotDateTime(appointmentDate, slotStartTime);
            const rescheduleEndTime = buildSlotEndTime(appointmentDate, slotStartTime, 30);

            const eventPayload = {
                appointmentId,
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                patientName: req.user.name || "Patient",
                doctorName: "Doctor",
                patientEmail: req.user.email,
                appointmentDate,
                slotStartTime,
                slotEndTime: slotStartTime,
                startTime: rescheduleStartTime,
                endTime: rescheduleEndTime
            };

            try {
                console.log('Publishing appointment.rescheduled', eventPayload);
                await publishEvent(Topics.APPOINTMENT_RESCHEDULED, eventPayload);
            } catch (publishError) {
                console.warn("Appointment reschedule event publish failed", publishError.message || publishError);
            }

            res.status(200).json({

                success: true,

                message: "Appointment rescheduled.",

                data: updatedAppointment

            });

        }

        finally {

            await releaseLock(lockKey);

        }

    } catch (err) {

        next(err);

    }

};

/* =====================================================
   GET MY APPOINTMENTS (PATIENT)
===================================================== */

exports.getMyAppointments = async (req, res, next) => {

    try {

        const patient = await withDbRetry(() => prisma.patient.findUnique({
            where: {
                userId: req.user.id
            }
        }));

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        const appointments = await prisma.appointment.findMany({

            where: {
                patientId: patient.id
            },

            include: {

                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }

            },

            orderBy: {
                appointmentDate: "desc"
            }

        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });

    } catch (err) {

        next(err);

    }

};



/* =====================================================
   GET DOCTOR APPOINTMENTS
===================================================== */

exports.getDoctorAppointments = async (req, res, next) => {

    try {

        const doctor = await prisma.doctor.findUnique({

            where: {
                userId: req.user.id
            }

        });

        if (!doctor) {

            return res.status(404).json({

                success: false,
                message: "Doctor not found."

            });

        }

        const appointments = await withDbRetry(() => prisma.appointment.findMany({

            where: {
                doctorId: doctor.id
            },

            include: {

                patient: {

                    include: {

                        user: {

                            select: {

                                id: true,
                                name: true,
                                email: true,
                                phone: true

                            }

                        }

                    }

                }

            },

            orderBy: {
                appointmentDate: "asc"
            }

        }));

        res.status(200).json({

            success: true,
            count: appointments.length,
            data: appointments

        });

    } catch (err) {

        next(err);

    }

};



/* =====================================================
   GET ALL APPOINTMENTS (ADMIN)
===================================================== */

exports.getAllAppointments = async (req, res, next) => {

    try {

        const appointments = await prisma.appointment.findMany({

            include: {

                patient: {

                    include: {

                        user: {

                            select: {

                                id: true,
                                name: true,
                                email: true

                            }

                        }

                    }

                },

                doctor: {

                    include: {

                        user: {

                            select: {

                                id: true,
                                name: true,
                                email: true

                            }

                        }

                    }

                }

            },

            orderBy: {
                appointmentDate: "desc"
            }

        });

        res.status(200).json({

            success: true,
            count: appointments.length,
            data: appointments

        });

    } catch (err) {

        next(err);

    }

};



/* =====================================================
   GET APPOINTMENT BY ID
===================================================== */

exports.getAppointmentById = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;

        const appointment = await prisma.appointment.findUnique({

            where: {
                id: appointmentId
            },

            include: {

                patient: {

                    include: {

                        user: {

                            select: {

                                id: true,
                                name: true,
                                email: true,
                                phone: true

                            }

                        }

                    }

                },

                doctor: {

                    include: {

                        user: {

                            select: {

                                id: true,
                                name: true,
                                email: true,
                                phone: true

                            }

                        }

                    }

                }

            }

        });

        if (!appointment) {

            return res.status(404).json({

                success: false,
                message: "Appointment not found."

            });

        }

        // RBAC Validation

        if (req.user.role === "PATIENT") {

            const patient = await prisma.patient.findUnique({

                where: {
                    userId: req.user.id
                }

            });

            if (appointment.patientId !== patient.id) {

                return res.status(403).json({

                    success: false,
                    message: "Unauthorized."

                });

            }

        }

        if (req.user.role === "DOCTOR") {

            const doctor = await prisma.doctor.findUnique({

                where: {
                    userId: req.user.id
                }

            });

            if (appointment.doctorId !== doctor.id) {

                return res.status(403).json({

                    success: false,
                    message: "Unauthorized."

                });

            }

        }

        res.status(200).json({

            success: true,
            data: appointment

        });

    } catch (err) {

        next(err);

    }

};



/* =====================================================
   SUBMIT SYMPTOMS (PATIENT)
===================================================== */

exports.submitSymptoms = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;
        const { symptoms } = req.body;

        const patient = await prisma.patient.findUnique({
            where: {
                userId: req.user.id
            }
        });

        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId
            }
        });

        if (!appointment) {

            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });

        }

        if (appointment.patientId !== patient.id) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });

        }

        const updateData = {};
        if (typeof symptoms !== "undefined") updateData.symptoms = symptoms?.toString().trim() || null;

        const updatedAppointment =
            await prisma.appointment.update({

                where: {
                    id: appointmentId
                },

                data: updateData

            });

        // Trigger LLM Worker

        try {
            const payload = {
                appointmentId,
                patientId: patient.id,
                patientName: patient.user?.name || req.user.name || "Patient",
                patientEmail: patient.user?.email || req.user.email,
                age: patient.age ?? null,
                gender: patient.gender ?? null,
                bloodGroup: patient.bloodGroup || null,
                symptoms: updatedAppointment.symptoms,
                urgencyLevel: updatedAppointment.urgencyLevel || null,
                doctorId: updatedAppointment.doctorId,
                appointmentDate: updatedAppointment.appointmentDate,
                slotStartTime: updatedAppointment.slotStartTime
            };

            console.log('Publishing symptoms.submitted', payload);
            await publishEvent(Topics.SYMPTOMS_SUBMITTED, payload);

        } catch (err) {

            console.error("Kafka Error:", err);

        }

        res.status(200).json({

            success: true,
            message: "Symptoms submitted successfully.",
            data: updatedAppointment

        });

    } catch (err) {

        next(err);

    }

};



/* =====================================================
   UPDATE APPOINTMENT STATUS (DOCTOR)
===================================================== */

exports.updateAppointmentStatus = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;

        const { status } = req.body;

        const doctor = await prisma.doctor.findUnique({

            where: {
                userId: req.user.id
            }

        });

        const appointment =
            await prisma.appointment.findUnique({

                where: {
                    id: appointmentId
                }

            });

        if (!appointment) {

            return res.status(404).json({

                success: false,
                message: "Appointment not found."

            });

        }

        if (appointment.doctorId !== doctor.id) {

            return res.status(403).json({

                success: false,
                message: "Unauthorized."

            });

        }

        const updatedAppointment =
            await prisma.appointment.update({

                where: {
                    id: appointmentId
                },

                data: {
                    status
                }

            });

        res.status(200).json({

            success: true,
            message: "Appointment updated successfully.",
            data: updatedAppointment

        });

    } catch (err) {

        next(err);

    }

};



/* =====================================================
    ADD CLINICAL NOTES (DOCTOR)
===================================================== */

/* =====================================================
   ADD CONSULTATION (UNIFIED DOCTOR ACTION)
===================================================== */

exports.addConsultation = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;

        const {
            clinicalNotes,
            prescriptionLog,
            status
        } = req.body;

        const doctor = await prisma.doctor.findUnique({

            where: {
                userId: req.user.id
            }

        });

        const appointment =
            await prisma.appointment.findUnique({

                where: {
                    id: appointmentId
                }

            });

        if (!appointment) {

            return res.status(404).json({

                success: false,
                message: "Appointment not found."

            });

        }

        if (appointment.doctorId !== doctor.id) {

            return res.status(403).json({

                success: false,
                message: "Unauthorized."

            });

        }

        const updateData = {};

        if (typeof clinicalNotes !== "undefined") updateData.clinicalNotes = clinicalNotes?.toString().trim() || null;
        if (typeof prescriptionLog !== "undefined") {
            try {
                updateData.prescriptionLog = typeof prescriptionLog === "string" ? JSON.parse(prescriptionLog) : prescriptionLog;
            } catch (e) {
                updateData.prescriptionLog = prescriptionLog;
            }
        }

        if (typeof status !== "undefined") updateData.status = status;

        const updatedAppointment = await prisma.appointment.update({

            where: {
                id: appointmentId
            },

            data: updateData

        });

        // Publish relevant events for downstream workers
        try {
            if (typeof clinicalNotes !== "undefined") {
                await publishEvent(Topics.CLINICAL_NOTES_ADDED, {
                    appointmentId,
                    patientId: appointment.patientId,
                    patientName: appointment.patient?.user?.name || req.user.name || "Patient",
                    doctorName: doctor.user?.name || "Doctor",
                    clinicalNotes: updateData.clinicalNotes
                });
            }

            if (typeof prescriptionLog !== "undefined") {
                await publishEvent(Topics.PRESCRIPTION_ADDED, {
                    appointmentId,
                    patientId: appointment.patientId,
                    patientName: appointment.patient?.user?.name || req.user.name || "Patient",
                    patientEmail: appointment.patient?.user?.email || req.user.email,
                    doctorId: appointment.doctorId,
                    doctorName: doctor.user?.name || "Doctor",
                    prescriptionLog: updateData.prescriptionLog
                });
            }
        } catch (err) {
            console.error("Kafka Error:", err);
        }

        res.status(200).json({

            success: true,
            message: "Consultation saved successfully.",
            data: updatedAppointment

        });

    } catch (err) {

        next(err);

    }

};


exports.addClinicalNotes = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;

        const { clinicalNotes } = req.body;

        const doctor = await prisma.doctor.findUnique({
            where: { userId: req.user.id }
        });

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }

        if (appointment.doctorId !== doctor.id) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { clinicalNotes }
        });

        try {
            await publishEvent(Topics.CLINICAL_NOTES_ADDED, {
                appointmentId,
                patientId: appointment.patientId,
                patientName: appointment.patient?.user?.name || req.user.name || "Patient",
                doctorName: doctor.user?.name || "Doctor",
                clinicalNotes
            });
        } catch (err) {
            console.error("Kafka Error:", err);
        }

        res.status(200).json({ success: true, message: "Clinical notes added.", data: updatedAppointment });

    } catch (err) {
        next(err);
    }

};



/* =====================================================
   ADD PRESCRIPTION
===================================================== */

exports.addPrescription = async (req, res, next) => {

    try {

        const { appointmentId } = req.params;

        const { prescriptionLog } = req.body;

        const doctor = await prisma.doctor.findUnique({

            where: {
                userId: req.user.id
            }

        });

        const appointment =
            await prisma.appointment.findUnique({

                where: {
                    id: appointmentId
                }

            });

        if (!appointment) {

            return res.status(404).json({

                success: false,
                message: "Appointment not found."

            });

        }

        if (appointment.doctorId !== doctor.id) {

            return res.status(403).json({

                success: false,
                message: "Unauthorized."

            });

        }

        const updatedAppointment =
            await prisma.appointment.update({

                where: {
                    id: appointmentId
                },

                data: {
                    prescriptionLog
                }

            });

        // Notify Reminder Service

        try {

            await publishEvent(Topics.PRESCRIPTION_ADDED, {
                appointmentId,
                patientId: appointment.patientId,
                patientName: appointment.patient?.user?.name || req.user.name || "Patient",
                patientEmail: appointment.patient?.user?.email || req.user.email,
                doctorId: appointment.doctorId,
                doctorName: appointment.doctor?.user?.name || "Doctor",
                appointmentDate: appointment.appointmentDate,
                slotStartTime: appointment.slotStartTime,
                prescriptionLog
            });

        } catch (err) {

            console.error("Kafka Error:", err);

        }

        res.status(200).json({

            success: true,
            message: "Prescription saved successfully.",
            data: updatedAppointment

        });

    } catch (err) {

        next(err);

    }

};