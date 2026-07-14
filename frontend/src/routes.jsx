import PatientDashboardPage from "./pages/patient/PatientDashboardPage";
import PatientAppointmentsPage from "./pages/patient/PatientAppointmentsPage";
import BookAppointmentPage from "./pages/patient/BookAppointmentPage";
import PatientRecordsPage from "./pages/patient/PatientRecordsPage";
import PatientPrescriptionsPage from "./pages/patient/PatientPrescriptionsPage";
import DoctorConsultationPage from "./pages/doctor/DoctorConsultationPage";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import NotificationsPage from "./pages/NotificationsPage";

import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import PatientHistoryPage from "./pages/doctor/PatientHistoryPage";
import WorkingHoursPage from "./pages/doctor/WorkingHoursPage";
import LeaveManagementPage from "./pages/doctor/LeaveManagementPage";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import DoctorManagementPage from "./pages/admin/DoctorManagementPage";
import PatientManagementPage from "./pages/admin/PatientManagementPage";
import AppointmentManagementPage from "./pages/admin/AppointmentManagementPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";

/* ===================================
   Patient Routes
=================================== */

export const patientRoutes = [

  {
    path: "",
    element: <PatientDashboardPage />
  },

  {
    path: "appointments",
    element: <PatientAppointmentsPage />
  },

  {
    path: "book",
    element: <BookAppointmentPage />
  },

  {
    path: "records",
    element: <PatientRecordsPage />
  },

  {
    path: "prescriptions",
    element: <PatientPrescriptionsPage />
  },

  {
    path: "profile",
    element: <PatientProfilePage />
  }

  ,{
    path: "notifications",
    element: <NotificationsPage />
  }

];

/* ===================================
   Doctor Routes
=================================== */

export const doctorRoutes = [

  {
    path: "",
    element: <DoctorDashboardPage />
  },

  {
    path: "appointments",
    element: <DoctorAppointmentsPage />
  },

  {
    path: "consultation",
    element: <DoctorConsultationPage />
  },

  {
    path: "patients",
    element: <PatientHistoryPage />
  },

  {
    path: "working-hours",
    element: <WorkingHoursPage />
  },

  {
    path: "leaves",
    element: <LeaveManagementPage />
  },

  {
    path: "profile",
    element: <DoctorProfilePage />
  }

  ,{
    path: "notifications",
    element: <NotificationsPage />
  }

];

/* ===================================
   Admin Routes
=================================== */

export const adminRoutes = [

  {
    path: "",
    element: <AdminDashboardPage />
  },

  {
    path: "doctors",
    element: <DoctorManagementPage />
  },

  {
    path: "patients",
    element: <PatientManagementPage />
  },

  {
    path: "appointments",
    element: <AppointmentManagementPage />
  },

  {
    path: "analytics",
    element: <AnalyticsPage />
  },

  {
    path: "settings",
    element: <SettingsPage />
  }

  ,{
    path: "notifications",
    element: <NotificationsPage />
  }

];