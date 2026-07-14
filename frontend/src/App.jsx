import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { registerForPush, listenForeground } from "./firebase/registerPush";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import AdminLayout from "./layouts/AdminLayout";

import {
  patientRoutes,
  doctorRoutes,
  adminRoutes,
} from "./routes";

/* =====================================
   Protected Route
===================================== */

function ProtectedRoute({ children, role }) {

  const { user, loading } = useAuth();

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">

        <motion.div

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          className="text-center"

        >

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-600">

            Preparing your workspace...

          </p>

        </motion.div>

      </div>

    );

  }

  if (!user) {

    return <Navigate to="/login" replace />;

  }

  if (role && user.role !== role) {

    switch (user.role) {

      case "PATIENT":
        return <Navigate to="/patient" replace />;

      case "DOCTOR":
        return <Navigate to="/doctor" replace />;

      case "ADMIN":
        return <Navigate to="/admin" replace />;

      default:
        return <Navigate to="/" replace />;

    }

  }

  return children;

}

/* =====================================
   Routes
===================================== */

function AppRoutes() {

  const { user } = useAuth();

  const dashboard = () => {

    if (!user) return "/";

    switch (user.role) {

      case "PATIENT":
        return "/patient";

      case "DOCTOR":
        return "/doctor";

      case "ADMIN":
        return "/admin";

      default:
        return "/";

    }

  };

  return (

    <Routes>

      {/* ---------------- Public ---------------- */}

      <Route

        path="/"

        element={

          user

            ? <Navigate to={dashboard()} replace />

            : <HomePage />

        }

      />

      <Route

        path="/login"

        element={

          user

            ? <Navigate to={dashboard()} replace />

            : <LoginPage />

        }

      />

      <Route

        path="/register"

        element={

          user

            ? <Navigate to={dashboard()} replace />

            : <RegisterPage />

        }

      />

      <Route

        path="/forgot-password"

        element={<ForgotPasswordPage />}

      />

      <Route

        path="/reset-password"

        element={<ResetPasswordPage />}

      />

      {/* ---------------- Patient ---------------- */}

      <Route

        path="/patient/*"

        element={

          <ProtectedRoute role="PATIENT">

            <PatientLayout />

          </ProtectedRoute>

        }

      >

        {

          patientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <React.Suspense fallback={<div className="p-6">Loading...</div>}>
                  {route.element}
                </React.Suspense>
              }
            />
          ))

        }

      </Route>

      {/* ---------------- Doctor ---------------- */}

      <Route

        path="/doctor/*"

        element={

          <ProtectedRoute role="DOCTOR">

            <DoctorLayout />

          </ProtectedRoute>

        }

      >

        {

          doctorRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <React.Suspense fallback={<div className="p-6">Loading...</div>}>
                  {route.element}
                </React.Suspense>
              }
            />
          ))

        }

      </Route>

      {/* ---------------- Admin ---------------- */}

      <Route

        path="/admin/*"

        element={

          <ProtectedRoute role="ADMIN">

            <AdminLayout />

          </ProtectedRoute>

        }

      >

        {

          adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <React.Suspense fallback={<div className="p-6">Loading...</div>}>
                  {route.element}
                </React.Suspense>
              }
            />
          ))

        }

      </Route>

      {/* ---------------- Fallback ---------------- */}

      <Route

        path="*"

        element={

          <Navigate

            to={

              user

                ? dashboard()

                : "/"

            }

            replace

          />

        }

      />

    </Routes>

  );

}

/* =====================================
   App
===================================== */

export default function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <InnerApp />

      </AuthProvider>

    </BrowserRouter>

  );


function InnerApp() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenForeground((payload) => {
      const title = payload?.notification?.title || "New notification";
      const body = payload?.notification?.body || "You have a new update.";
      toast.success(`${title}: ${body}`);
    });

    registerForPush(user.id).catch(() => {});

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => {});
    }

    return () => unsubscribe?.();
  }, [user]);

  return (
    <>
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid rgba(148, 163, 184, 0.25)",
            boxShadow: "0 16px 50px -24px rgba(15, 23, 42, 0.2)",
          },
        }}
      />
    </>
  );
}
}