
```
healthcare-appointment-follow-up-manager
├─ frontend
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-B6wlb5i7.css
│  │  │  └─ index-D3Xbvy3B.js
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ AppointmentCard.jsx
│  │  │  ├─ ConfirmDialog.jsx
│  │  │  ├─ DashboardCard.jsx
│  │  │  ├─ DataTable.jsx
│  │  │  ├─ DoctorCard.jsx
│  │  │  ├─ EmptyState.jsx
│  │  │  ├─ FormDatePicker.jsx
│  │  │  ├─ FormInput.jsx
│  │  │  ├─ FormSelect.jsx
│  │  │  ├─ FormTextarea.jsx
│  │  │  ├─ GlassCard.jsx
│  │  │  ├─ LoadingSkeleton.jsx
│  │  │  ├─ Modal.jsx
│  │  │  ├─ PageHeader.jsx
│  │  │  ├─ PatientCard.jsx
│  │  │  ├─ ProfileCard.jsx
│  │  │  ├─ SearchBar.jsx
│  │  │  ├─ SectionTitle.jsx
│  │  │  ├─ StatCard.jsx
│  │  │  └─ StatusBadge.jsx
│  │  ├─ contexts
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ DoctorLayout.jsx
│  │  │  └─ PatientLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminDashboardPage.jsx
│  │  │  │  ├─ AnalyticsPage.jsx
│  │  │  │  ├─ AppointmentManagementPage.jsx
│  │  │  │  ├─ DoctorManagementPage.jsx
│  │  │  │  ├─ PatientManagementPage.jsx
│  │  │  │  └─ SettingsPage.jsx
│  │  │  ├─ doctor
│  │  │  │  ├─ ClinicalNotesPage.jsx
│  │  │  │  ├─ DoctorAppointmentsPage.jsx
│  │  │  │  ├─ DoctorDashboardPage.jsx
│  │  │  │  ├─ DoctorPrescriptionsPage.jsx
│  │  │  │  ├─ DoctorProfilePage.jsx
│  │  │  │  ├─ LeaveManagementPage.jsx
│  │  │  │  ├─ PatientHistoryPage.jsx
│  │  │  │  └─ WorkingHoursPage.jsx
│  │  │  ├─ ForgotPasswordPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ patient
│  │  │  │  ├─ BookAppointmentPage.jsx
│  │  │  │  ├─ PatientAppointmentsPage.jsx
│  │  │  │  ├─ PatientDashboardPage.jsx
│  │  │  │  ├─ PatientPrescriptionsPage.jsx
│  │  │  │  ├─ PatientProfilePage.jsx
│  │  │  │  ├─ PatientRecordsPage.jsx
│  │  │  │  └─ SymptomsPage.jsx
│  │  │  ├─ RegisterPage.jsx
│  │  │  └─ ResetPasswordPage.jsx
│  │  ├─ routes.jsx
│  │  ├─ services
│  │  │  └─ api.js
│  │  └─ utils
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ notification-service
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  └─ src
│     ├─ config
│     │  ├─ email.js
│     │  ├─ firebase-service-account.json
│     │  ├─ firebase.js
│     │  ├─ googleCalender.js
│     │  └─ prisma.js
│     ├─ constants
│     │  └─ notificationTypes.js
│     ├─ consumer
│     │  └─ notificationConsumer.js
│     ├─ index.js
│     ├─ prisma
│     │  └─ schema.prisma
│     ├─ services
│     │  ├─ calendarService.js
│     │  ├─ emailService.js
│     │  ├─ inAppNotificationService.js
│     │  └─ notificationTemplates.js
│     └─ utils
│        └─ kafkaConsumer.js
└─ src
   ├─ .env
   ├─ config
   │  ├─ prisma.js
   │  └─ redis.js
   ├─ controllers
   │  ├─ adminController.js
   │  ├─ appointmentController.js
   │  ├─ authController.js
   │  ├─ doctorController.js
   │  └─ patientController.js
   ├─ index.js
   ├─ middleware
   │  ├─ authMiddleware.js
   │  ├─ errorHandler.js
   │  └─ roleMiddleware.js
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260711075828_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260712104330_add_google_calendar_support
   │  │  │  └─ migration.sql
   │  │  ├─ 20260712105227_add_notifications
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  ├─ schema.prisma
   │  └─ seed.js
   ├─ README.md
   ├─ routes
   │  ├─ adminRoutes.js
   │  ├─ appointmentRoutes.js
   │  ├─ authRoutes.js
   │  ├─ doctorRoutes.js
   │  └─ patientRoutes.js
   └─ utils
      ├─ kafkaProducer.js
      ├─ kafkaTopics.js
      └─ redisLock.js

```

## Docker Deployment

This repository includes a production Docker Compose stack that runs the frontend behind Nginx and keeps every service internal except Nginx on port `80`.

### Start the stack

Create a root `.env` file with deployment secrets and shared service settings, then run:

```bash
docker compose up --build
```

Open the application at:

```text
http://localhost
```

### Included services

- `nginx` reverse proxy and static frontend host
- `frontend` built with Vite and served by Nginx
- `backend` on internal port `3000`
- `notification-service` on internal port `4001`
- `llm-service` on internal port `4002`
- `scheduler-service` on internal port `4003`
- `redis` on internal port `6379`
- `zookeeper` on internal port `2181`
- `kafka` on internal port `9092`

### Environment variables

At minimum, provide values for:

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://redis:6379
KAFKA_BROKER=kafka:9092
JWT_SECRET=...
GROQ_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
```

### Notes

- No PostgreSQL container is included because the application uses AWS RDS.
- Internal service calls use Docker DNS names such as `backend`, `frontend`, `redis`, and `kafka`.
- The frontend uses `/api` and `/api/notifications` so requests stay behind the Nginx entrypoint.
```
healthcare-appointment-follow-up-manager
├─ frontend
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-B6wlb5i7.css
│  │  │  └─ index-D3Xbvy3B.js
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ AppointmentCard.jsx
│  │  │  ├─ ConfirmDialog.jsx
│  │  │  ├─ DashboardCard.jsx
│  │  │  ├─ DataTable.jsx
│  │  │  ├─ DoctorCard.jsx
│  │  │  ├─ EmptyState.jsx
│  │  │  ├─ FormDatePicker.jsx
│  │  │  ├─ FormInput.jsx
│  │  │  ├─ FormSelect.jsx
│  │  │  ├─ FormTextarea.jsx
│  │  │  ├─ GlassCard.jsx
│  │  │  ├─ LoadingSkeleton.jsx
│  │  │  ├─ Modal.jsx
│  │  │  ├─ PageHeader.jsx
│  │  │  ├─ PatientCard.jsx
│  │  │  ├─ ProfileCard.jsx
│  │  │  ├─ SearchBar.jsx
│  │  │  ├─ SectionTitle.jsx
│  │  │  ├─ StatCard.jsx
│  │  │  └─ StatusBadge.jsx
│  │  ├─ contexts
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ DoctorLayout.jsx
│  │  │  └─ PatientLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminDashboardPage.jsx
│  │  │  │  ├─ AnalyticsPage.jsx
│  │  │  │  ├─ AppointmentManagementPage.jsx
│  │  │  │  ├─ DoctorManagementPage.jsx
│  │  │  │  ├─ PatientManagementPage.jsx
│  │  │  │  └─ SettingsPage.jsx
│  │  │  ├─ doctor
│  │  │  │  ├─ ClinicalNotesPage.jsx
│  │  │  │  ├─ DoctorAppointmentsPage.jsx
│  │  │  │  ├─ DoctorDashboardPage.jsx
│  │  │  │  ├─ DoctorPrescriptionsPage.jsx
│  │  │  │  ├─ DoctorProfilePage.jsx
│  │  │  │  ├─ LeaveManagementPage.jsx
│  │  │  │  ├─ PatientHistoryPage.jsx
│  │  │  │  └─ WorkingHoursPage.jsx
│  │  │  ├─ ForgotPasswordPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ patient
│  │  │  │  ├─ BookAppointmentPage.jsx
│  │  │  │  ├─ PatientAppointmentsPage.jsx
│  │  │  │  ├─ PatientDashboardPage.jsx
│  │  │  │  ├─ PatientPrescriptionsPage.jsx
│  │  │  │  ├─ PatientProfilePage.jsx
│  │  │  │  ├─ PatientRecordsPage.jsx
│  │  │  │  └─ SymptomsPage.jsx
│  │  │  ├─ RegisterPage.jsx
│  │  │  └─ ResetPasswordPage.jsx
│  │  ├─ routes.jsx
│  │  ├─ services
│  │  │  └─ api.js
│  │  └─ utils
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ llm-service
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  └─ schema.prisma
│  └─ src
│     ├─ config
│     │  ├─ gemini.js
│     │  └─ prisma.js
│     ├─ constants
│     │  └─ kafkaTopics.js
│     ├─ consumers
│     │  └─ llmConsumer.js
│     ├─ index.js
│     ├─ prompts
│     │  ├─ postVisitPrompt.js
│     │  └─ preVisitPrompt.js
│     ├─ services
│     │  ├─ geminiService.js
│     │  ├─ postVisitSummaryService.js
│     │  └─ preVisitSummaryService.js
│     └─ utils
│        └─ kafkaConsumer.js
├─ notification-service
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  └─ schema.prisma
│  └─ src
│     ├─ config
│     │  ├─ email.js
│     │  ├─ firebase-service-account.json
│     │  ├─ firebase.js
│     │  ├─ googleCalendar.js
│     │  └─ prisma.js
│     ├─ constants
│     │  └─ notificationTypes.js
│     ├─ consumer
│     │  └─ notificationConsumer.js
│     ├─ index.js
│     ├─ services
│     │  ├─ calendarService.js
│     │  ├─ emailService.js
│     │  ├─ inAppNotificationService.js
│     │  └─ notificationTemplates.js
│     └─ utils
│        └─ kafkaConsumer.js
├─ README.md
└─ src
   ├─ .env
   ├─ config
   │  ├─ prisma.js
   │  └─ redis.js
   ├─ controllers
   │  ├─ adminController.js
   │  ├─ appointmentController.js
   │  ├─ authController.js
   │  ├─ doctorController.js
   │  └─ patientController.js
   ├─ index.js
   ├─ middleware
   │  ├─ authMiddleware.js
   │  ├─ errorHandler.js
   │  └─ roleMiddleware.js
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260711075828_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260712104330_add_google_calendar_support
   │  │  │  └─ migration.sql
   │  │  ├─ 20260712105227_add_notifications
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  ├─ schema.prisma
   │  └─ seed.js
   ├─ README.md
   ├─ routes
   │  ├─ adminRoutes.js
   │  ├─ appointmentRoutes.js
   │  ├─ authRoutes.js
   │  ├─ doctorRoutes.js
   │  └─ patientRoutes.js
   └─ utils
      ├─ kafkaProducer.js
      ├─ kafkaTopics.js
      └─ redisLock.js

```
```
healthcare-appointment-follow-up-manager
├─ DESIGN-wise.md
├─ docker-compose.yml
├─ frontend
│  ├─ .dockerignore
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ BookAppointmentPage-BUJqOUD0.js
│  │  │  ├─ clipboard-check-BdYcbGt1.js
│  │  │  ├─ createLucideIcon-51WMdWvx.js
│  │  │  ├─ DoctorAppointmentsPage-D4EDUEFU.js
│  │  │  ├─ DoctorConsultationPage-CEVhAE8W.js
│  │  │  ├─ DoctorDashboardPage-C7sd7Tiy.js
│  │  │  ├─ index-B_OxhLIF.css
│  │  │  ├─ index-DaY4JfOE.js
│  │  │  ├─ PatientAppointmentsPage-CJhILI2N.js
│  │  │  └─ PatientDashboardPage-DIM11UYb.js
│  │  ├─ favicon.svg
│  │  ├─ firebase-messaging-sw.js
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ Dockerfile
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  ├─ firebase-messaging-sw.js
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ AppointmentCard.jsx
│  │  │  ├─ ConfirmDialog.jsx
│  │  │  ├─ DashboardCard.jsx
│  │  │  ├─ DataTable.jsx
│  │  │  ├─ DoctorCard.jsx
│  │  │  ├─ EmptyState.jsx
│  │  │  ├─ FormDatePicker.jsx
│  │  │  ├─ FormInput.jsx
│  │  │  ├─ FormSelect.jsx
│  │  │  ├─ FormTextarea.jsx
│  │  │  ├─ GlassCard.jsx
│  │  │  ├─ LoadingSkeleton.jsx
│  │  │  ├─ Modal.jsx
│  │  │  ├─ NotificationCenter.jsx
│  │  │  ├─ PageHeader.jsx
│  │  │  ├─ PatientCard.jsx
│  │  │  ├─ ProfileCard.jsx
│  │  │  ├─ SearchBar.jsx
│  │  │  ├─ SectionTitle.jsx
│  │  │  ├─ StatCard.jsx
│  │  │  ├─ StatusBadge.jsx
│  │  │  └─ ui
│  │  │     ├─ AutosaveIndicator.jsx
│  │  │     ├─ Badge.jsx
│  │  │     ├─ Button.jsx
│  │  │     └─ Card.jsx
│  │  ├─ contexts
│  │  │  └─ AuthContext.jsx
│  │  ├─ firebase
│  │  │  └─ registerPush.js
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ DoctorLayout.jsx
│  │  │  └─ PatientLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AdminDashboardPage.jsx
│  │  │  │  ├─ AnalyticsPage.jsx
│  │  │  │  ├─ AppointmentManagementPage.jsx
│  │  │  │  ├─ DoctorManagementPage.jsx
│  │  │  │  ├─ PatientManagementPage.jsx
│  │  │  │  └─ SettingsPage.jsx
│  │  │  ├─ doctor
│  │  │  │  ├─ ClinicalNotesPage.jsx
│  │  │  │  ├─ DoctorAppointmentsPage.jsx
│  │  │  │  ├─ DoctorConsultationPage.jsx
│  │  │  │  ├─ DoctorDashboardPage.jsx
│  │  │  │  ├─ DoctorPrescriptionsPage.jsx
│  │  │  │  ├─ DoctorProfilePage.jsx
│  │  │  │  ├─ LeaveManagementPage.jsx
│  │  │  │  ├─ PatientHistoryPage.jsx
│  │  │  │  └─ WorkingHoursPage.jsx
│  │  │  ├─ ForgotPasswordPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ NotificationsPage.jsx
│  │  │  ├─ patient
│  │  │  │  ├─ BookAppointmentPage.jsx
│  │  │  │  ├─ PatientAppointmentsPage.jsx
│  │  │  │  ├─ PatientDashboardPage.jsx
│  │  │  │  ├─ PatientPrescriptionsPage.jsx
│  │  │  │  ├─ PatientProfilePage.jsx
│  │  │  │  └─ PatientRecordsPage.jsx
│  │  │  ├─ RegisterPage.jsx
│  │  │  └─ ResetPasswordPage.jsx
│  │  ├─ routes.jsx
│  │  ├─ services
│  │  │  └─ api.js
│  │  └─ utils
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ llm-service
│  ├─ .dockerignore
│  ├─ Dockerfile
│  ├─ logs
│  │  └─ llm_responses.log
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  └─ schema.prisma
│  ├─ scripts
│  │  └─ publishTestEvent.js
│  └─ src
│     ├─ .env
│     ├─ config
│     │  ├─ groq.js
│     │  ├─ prisma.js
│     │  └─ testGroq.js
│     ├─ constants
│     │  └─ kafkaTopics.js
│     ├─ consumers
│     │  └─ llmConsumer.js
│     ├─ index.js
│     ├─ prompts
│     │  ├─ postVisitPrompt.js
│     │  └─ preVisitPrompt.js
│     ├─ services
│     │  ├─ groqService.js
│     │  ├─ postVisitSummaryService.js
│     │  └─ preVisitSummaryService.js
│     ├─ testGroq.js
│     └─ utils
│        ├─ kafkaConsumer.js
│        └─ llmLogger.js
├─ nginx
│  └─ nginx.conf
├─ notification-service
│  ├─ .dockerignore
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  └─ schema.prisma
│  └─ src
│     ├─ config
│     │  ├─ email.js
│     │  ├─ firebase-service-account.json
│     │  ├─ firebase.js
│     │  ├─ googleCalendar.js
│     │  └─ prisma.js
│     ├─ constants
│     │  └─ notificationTypes.js
│     ├─ consumer
│     │  └─ notificationConsumer.js
│     ├─ controllers
│     │  └─ tokenController.js
│     ├─ index.js
│     ├─ jobs
│     │  └─ cleanupPushTokens.js
│     ├─ routes
│     │  └─ tokenRoutes.js
│     ├─ scripts
│     │  └─ add_push_token_table.js
│     ├─ services
│     │  ├─ calendarService.js
│     │  ├─ emailService.js
│     │  ├─ inAppNotificationService.js
│     │  └─ notificationTemplates.js
│     └─ utils
│        ├─ kafkaConsumer.js
│        └─ metrics.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ scheduler-service
│  ├─ .dockerignore
│  ├─ .env
│  ├─ Dockerfile
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  └─ schema.prisma
│  └─ src
│     ├─ config
│     │  └─ prisma.js
│     ├─ index.js
│     ├─ jobs
│     │  ├─ appointmentReminderJob.js
│     │  ├─ followUpReminderJob.js
│     │  ├─ medicationReminderJob.js
│     │  └─ missedAppointmentJob.js
│     ├─ services
│     │  └─ reminderService.js
│     └─ utils
│        └─ kafkaProducer.js
└─ src
   ├─ .dockerignore
   ├─ .env
   ├─ config
   │  ├─ prisma.js
   │  └─ redis.js
   ├─ controllers
   │  ├─ adminController.js
   │  ├─ appointmentController.js
   │  ├─ authController.js
   │  ├─ doctorController.js
   │  ├─ googleCalendarController.js
   │  ├─ notificationController.js
   │  └─ patientController.js
   ├─ Dockerfile
   ├─ index.js
   ├─ middleware
   │  ├─ asyncHandler.js
   │  ├─ authMiddleware.js
   │  ├─ errorHandler.js
   │  └─ roleMiddleware.js
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260711075828_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260712104330_add_google_calendar_support
   │  │  │  └─ migration.sql
   │  │  ├─ 20260712105227_add_notifications
   │  │  │  └─ migration.sql
   │  │  ├─ 20260714110233_add_medical_history
   │  │  └─ migration_lock.toml
   │  ├─ schema.prisma
   │  └─ seed.js
   ├─ README.md
   ├─ routes
   │  ├─ adminRoutes.js
   │  ├─ appointmentRoutes.js
   │  ├─ authRoutes.js
   │  ├─ doctorRoutes.js
   │  ├─ googleCalendarRoutes.js
   │  ├─ notificationRoutes.js
   │  └─ patientRoutes.js
   ├─ scripts
   │  ├─ add_columns_migration.js
   │  ├─ add_missing_columns.js
   │  ├─ consume_topic.js
   │  ├─ e2e_create_and_publish.js
   │  ├─ get_appointment.js
   │  └─ publish_prescription.js
   └─ utils
      ├─ db.js
      ├─ kafkaProducer.js
      ├─ kafkaTopics.js
      └─ redisLock.js

```