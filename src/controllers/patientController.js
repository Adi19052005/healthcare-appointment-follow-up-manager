const prisma = require("../config/prisma");

/* ===========================
   Dashboard
=========================== */

exports.getDashboard = async (req, res, next) => {

    try {

        const patient = await prisma.patient.findUnique({
            where: {
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        const [
            totalAppointments,
            upcomingAppointments,
            completedAppointments
        ] = await Promise.all([

            prisma.appointment.count({
                where: {
                    patientId: patient.id
                }
            }),

            prisma.appointment.count({
                where: {
                    patientId: patient.id,
                    status: "BOOKED"
                }
            }),

            prisma.appointment.count({
                where: {
                    patientId: patient.id,
                    status: "COMPLETED"
                }
            })

        ]);

        res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                upcomingAppointments,
                completedAppointments
            }
        });

    } catch (err) {
        next(err);
    }

};

/* ===========================
   Get Profile
=========================== */

exports.getProfile = async (req, res, next) => {

    try {

        const patient = await prisma.patient.findUnique({

            where: {
                userId: req.user.id
            },

            include: {
                user: true
            }

        });

        if (!patient) {

            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });

        }

        res.status(200).json({
            success: true,
            data: patient
        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Update Profile
=========================== */

exports.updateProfile = async (req, res, next) => {

    try {

        const patient = await prisma.patient.findUnique({
            where: {
                userId: req.user.id
            }
        });

        if (!patient) {

            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });

        }

        const {
            name,
            email,
            phone
        } = req.body;

        await prisma.$transaction([

            prisma.user.update({

                where: {
                    id: req.user.id
                },

                data: {
                    name,
                    email,
                    phone
                }

            })

        ]);

        const updatedPatient = await prisma.patient.findUnique({

            where: {
                id: patient.id
            },

            include: {
                user: true
            }

        });

        res.status(200).json({

            success: true,
            message: "Profile updated successfully.",
            data: updatedPatient

        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Update Medical Information
=========================== */

exports.updateMedicalInfo = async (req, res, next) => {

    try {

        const {

            age,
            gender,
            bloodGroup,
            allergies

        } = req.body;

        const patient = await prisma.patient.update({

            where: {
                userId: req.user.id
            },

            data: {

                age,
                gender,
                bloodGroup,
                allergies

            }

        });

        res.status(200).json({

            success: true,
            message: "Medical information updated successfully.",
            data: patient

        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Public Doctor Directory (for Patients)
=========================== */

exports.getDoctors = async (req, res, next) => {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                user: true
            },
            orderBy: {
                user: {
                    name: "asc"
                }
            }
        });

        res.status(200).json({
            success: true,
            data: doctors
        });

    } catch (err) {
        next(err);
    }
};

exports.getDoctorAvailability = async (req, res, next) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query; // expected YYYY-MM-DD

        if (!date) {
            return res.status(400).json({ success: false, message: "Missing date query parameter." });
        }

        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found." });
        }

        // Check leave
        const leave = await prisma.doctorLeave.findFirst({ where: { doctorId, leaveDate: new Date(date) } });
        if (leave) {
            return res.status(200).json({ success: true, data: [] });
        }

        const start = doctor.workingHoursStart || "09:00";
        const end = doctor.workingHoursEnd || "17:00";
        const duration = Number(doctor.slotDurationMins) || 30;

        const [startHour, startMinute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);

        let current = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        const slots = [];

        while (current < endTime) {
            const hour = String(Math.floor(current / 60)).padStart(2, "0");
            const minute = String(current % 60).padStart(2, "0");
            slots.push(`${hour}:${minute}`);
            current += duration;
        }

        // Filter out already booked appointments for that doctor/date
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: new Date(date)
            },
            select: { slotStartTime: true }
        });

        const booked = new Set(appointments.map((a) => a.slotStartTime));

        const available = slots.filter((s) => !booked.has(s));

        res.status(200).json({ success: true, data: available });

    } catch (err) {
        next(err);
    }
};