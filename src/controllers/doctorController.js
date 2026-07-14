const prisma = require("../config/prisma");
const { withDbRetry } = require("../utils/db");

/* ===========================
   Dashboard
=========================== */

exports.getDashboard = async (req, res, next) => {

    try {

        const doctor = await withDbRetry(() => prisma.doctor.findUnique({
            where: {
                userId: req.user.id
            }
        }));

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor profile not found." });
        }

        const [
            totalAppointments,
            completedAppointments,
            upcomingAppointments
        ] = await Promise.all([

            prisma.appointment.count({
                where: {
                    doctorId: doctor.id
                }
            }),

            prisma.appointment.count({
                where: {
                    doctorId: doctor.id,
                    status: "COMPLETED"
                }
            }),

            prisma.appointment.count({
                where: {
                    doctorId: doctor.id,
                    status: "BOOKED"
                }
            })

        ]);

        res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                completedAppointments,
                upcomingAppointments
            }
        });

    } catch (err) {
        next(err);
    }

};

/* ===========================
   Profile
=========================== */

exports.getProfile = async (req, res, next) => {

    try {

        const doctor = await withDbRetry(() => prisma.doctor.findUnique({
            where: {
                userId: req.user.id
            },
            include: {
                user: true
            }
        }));

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor profile not found." });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });

    } catch (err) {

        next(err);

    }

};

exports.updateProfile = async (req, res, next) => {

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

        const {

            name,
            email,
            phone,
            specialization,
            experience,
            consultationFee

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

            }),

            prisma.doctor.update({

                where: {
                    id: doctor.id
                },

                data: {
                    specialization,
                    experience,
                    consultationFee
                }

            })

        ]);

        const updatedDoctor = await prisma.doctor.findUnique({

            where: {
                id: doctor.id
            },

            include: {
                user: true
            }

        });

        res.status(200).json({

            success: true,
            message: "Profile updated successfully.",
            data: updatedDoctor

        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Working Hours
=========================== */

exports.updateWorkingHours = async (req, res, next) => {

    try {

        const {

            workingHoursStart,
            workingHoursEnd,
            slotDurationMins

        } = req.body;

        const doctor = await prisma.doctor.update({

            where: {
                userId: req.user.id
            },

            data: {

                workingHoursStart,
                workingHoursEnd,
                slotDurationMins

            }

        });

        res.status(200).json({

            success: true,
            message: "Working hours updated successfully.",
            data: doctor

        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Leave Management
=========================== */

exports.getDoctorLeaves = async (req, res, next) => {

    try {

        const doctor = await withDbRetry(() => prisma.doctor.findUnique({
            where: {
                userId: req.user.id
            }
        }));

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor profile not found." });
        }

        const leaves = await withDbRetry(() => prisma.doctorLeave.findMany({

            where: {
                doctorId: doctor.id
            },

            orderBy: {
                leaveDate: "asc"
            }

        }));

        res.status(200).json({

            success: true,
            data: leaves

        });

    } catch (err) {

        next(err);

    }

};

exports.addDoctorLeave = async (req, res, next) => {

    try {

        const doctor = await prisma.doctor.findUnique({

            where: {
                userId: req.user.id
            }

        });

        const { leaveDate } = req.body;

        const leave = await prisma.doctorLeave.create({

            data: {

                doctorId: doctor.id,
                leaveDate: new Date(leaveDate)

            }

        });

        res.status(201).json({

            success: true,
            message: "Leave added successfully.",
            data: leave

        });

    } catch (err) {

        next(err);

    }

};

exports.deleteDoctorLeave = async (req, res, next) => {

    try {

        await prisma.doctorLeave.delete({

            where: {
                id: req.params.leaveId
            }

        });

        res.status(200).json({

            success: true,
            message: "Leave deleted successfully."

        });

    } catch (err) {

        next(err);

    }

};

/* ===========================
   Patient History
=========================== */

exports.getPatientHistory = async (req, res, next) => {

    try {

        const { patientId } = req.params;

        const history = await withDbRetry(() => prisma.appointment.findMany({

            where: {
                patientId
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

            },

            orderBy: {
                appointmentDate: "desc"
            }

        }));

        res.status(200).json({

            success: true,
            data: history

        });

    } catch (err) {

        next(err);

    }

};