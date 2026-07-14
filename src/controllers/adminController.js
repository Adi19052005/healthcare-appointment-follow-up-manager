const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

/* ===========================
   Dashboard
=========================== */

exports.getDashboard = async (req, res, next) => {
    try {

        const [
            totalDoctors,
            totalPatients,
            totalAppointments,
            completedAppointments,
            cancelledAppointments
        ] = await Promise.all([
            prisma.doctor.count(),
            prisma.patient.count(),
            prisma.appointment.count(),
            prisma.appointment.count({
                where: { status: "COMPLETED" }
            }),
            prisma.appointment.count({
                where: { status: "CANCELLED" }
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                completedAppointments,
                cancelledAppointments
            }
        });

    } catch (err) {
        next(err);
    }
};

/* ===========================
   Doctor Management
=========================== */

exports.createDoctor = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            specialization,
            experience,
            consultationFee
        } = req.body;

        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Doctor already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await prisma.user.create({

            data: {

                name,
                email,
                password: hashedPassword,
                phone,
                role: "DOCTOR",

                doctor: {

                    create: {

                        specialization,
                        experience,
                        consultationFee

                    }

                }

            },

            include: {
                doctor: true
            }

        });

        res.status(201).json({
            success: true,
            message: "Doctor created successfully.",
            data: doctor
        });

    } catch (err) {
        next(err);
    }

};

exports.getAllDoctors = async (req, res, next) => {

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

exports.updateDoctor = async (req, res, next) => {

    try {

        const { doctorId } = req.params;

        const {
            name,
            email,
            phone,
            specialization,
            experience,
            consultationFee,
            workingHoursStart,
            workingHoursEnd,
            slotDurationMins
        } = req.body;

        // Find doctor first to get the linked userId
        const existingDoctor = await prisma.doctor.findUnique({
            where: { id: doctorId }
        });

        if (!existingDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        const [, updatedDoctor] = await prisma.$transaction([

            prisma.user.update({
                where: {
                    id: existingDoctor.userId
                },
                data: {
                    name,
                    email,
                    phone
                }
            }),

            prisma.doctor.update({
                where: {
                    id: doctorId
                },
                data: {
                    specialization,
                    experience,
                    consultationFee,
                    workingHoursStart,
                    workingHoursEnd,
                    slotDurationMins
                }
            })

        ]);

        res.status(200).json({
            success: true,
            message: "Doctor updated successfully.",
            data: updatedDoctor
        });

    } catch (err) {
        next(err);
    }

};

exports.deleteDoctor = async (req, res, next) => {

    try {

        const { doctorId } = req.params;

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId }
        });

        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });

        }

        await prisma.user.delete({

            where: {
                id: doctor.userId
            }

        });

        res.status(200).json({

            success: true,
            message: "Doctor deleted successfully."

        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Patient Management
=========================== */

exports.getAllPatients = async (req, res, next) => {

    try {

        const patients = await prisma.patient.findMany({

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
            data: patients

        });

    } catch (err) {

        next(err);

    }

};

exports.getPatientById = async (req, res, next) => {

    try {

        const patient = await prisma.patient.findUnique({

            where: {
                id: req.params.patientId
            },

            include: {

                user: true,

                appointments: {
                    include: {
                        doctor: {
                            include: {
                                user: true
                            }
                        }
                    }
                }

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

exports.deletePatient = async (req, res, next) => {

    try {

        const { patientId } = req.params;

        const patient = await prisma.patient.findUnique({

            where: {
                id: patientId
            }

        });

        if (!patient) {

            return res.status(404).json({

                success: false,
                message: "Patient not found."

            });

        }

        await prisma.user.delete({

            where: {
                id: patient.userId
            }

        });

        res.status(200).json({

            success: true,
            message: "Patient deleted successfully."

        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Appointment Management
=========================== */

exports.getAllAppointments = async (req, res, next) => {

    try {

        const appointments = await prisma.appointment.findMany({

            include: {

                patient: {
                    include: {
                        user: true
                    }
                },

                doctor: {
                    include: {
                        user: true
                    }
                }

            },

            orderBy: {
                appointmentDate: "desc"
            }

        });

        res.status(200).json({

            success: true,
            data: appointments

        });

    } catch (err) {

        next(err);

    }

};

exports.getAppointmentById = async (req, res, next) => {

    try {

        const appointment = await prisma.appointment.findUnique({

            where: {
                id: req.params.appointmentId
            },

            include: {

                patient: {
                    include: {
                        user: true
                    }
                },

                doctor: {
                    include: {
                        user: true
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

        res.status(200).json({

            success: true,
            data: appointment

        });

    } catch (err) {

        next(err);

    }

};