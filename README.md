# 🏥 Healthcare Appointment & Follow-up Manager

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis)
![Apache Kafka](https://img.shields.io/badge/Kafka-Event--Driven-black?style=for-the-badge&logo=apachekafka)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazonaws)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge)
![LLM](https://img.shields.io/badge/AI-Groq%20Llama%203.3-blueviolet?style=for-the-badge)

### AI-powered Event-Driven Healthcare Appointment Management Platform

A production-inspired healthcare appointment platform that enables **patients, doctors, and administrators** to efficiently manage appointments, AI-assisted consultation workflows, automated notifications, medication reminders, and Google Calendar integration using an event-driven microservices architecture.

---

🌐 **Live Demo**

**Application:** http://16.58.164.97/

**Public DNS:** http://http://ec2-16-58-164-97.us-east-2.compute.amazonaws.com/

**GitHub Repository**

https://github.com/Adi19052005/healthcare-appointment-follow-up-manager

</div>

---

# 🏗 System Architecture


<img width="1915" height="876" alt="image" src="https://github.com/user-attachments/assets/ac833e28-6633-4470-90da-a9398b87f6ee" />


---
## 🔑 Admin Access

For the convenience of reviewers and evaluators, sample administrator credentials are provided in the repository.

The admin login details can be found in:

```text
admin access.json
```

Use the credentials from this file to log in to the **Admin Portal** and explore administrative features such as:

- Dashboard & Analytics
- Doctor Management
- Patient Management
- Appointment Management
- Leave Management
- Working Hours Configuration

> **Note:** These credentials are intended **only for demonstration and evaluation purposes**. In a production environment, sensitive credentials should never be stored in the repository and should instead be managed securely using environment variables or a secrets management service.
>
> 
# 📖 Table of Contents

- Overview
- Features
- System Architecture
- Microservices Architecture
- Technology Stack
- Folder Structure
- Appointment Workflow
- AI Integration
- Event Driven Architecture
- Deployment Architecture
- Docker Deployment
- Local Setup
- Environment Variables
- API Overview
- Future Improvements
- License

---

# 🚀 Overview

Healthcare Appointment & Follow-up Manager is a production-inspired appointment management system built around modern backend engineering principles.

Unlike a traditional CRUD appointment booking application, this platform incorporates:

- AI-assisted pre-visit symptom summarization
- AI-generated post-visit patient summaries
- Event-driven communication using Apache Kafka
- Distributed locking using Redis to prevent double booking
- Background scheduling for reminders
- Google Calendar synchronization
- Email notifications
- JWT Role-Based Authentication
- Containerized microservices deployed on AWS EC2

The system separates responsibilities into independent services, making it scalable, fault tolerant, and easier to maintain.

---

# ✨ Features

## 👤 Patient Portal

- User Registration & Login
- JWT Authentication
- Doctor Search by Specialization
- Doctor Availability
- Appointment Booking
- AI Symptom Submission
- Appointment History
- Medical Records
- Prescriptions
- Medication Reminders
- Google Calendar Integration
- Email Notifications

---

## 👨‍⚕️ Doctor Portal

- Doctor Dashboard
- View Scheduled Appointments
- Clinical Notes
- Digital Prescription
- AI Generated Patient Summary
- Leave Management
- Working Hours Management
- Appointment Status Updates

---

## 🛠 Admin Portal

- Dashboard
- Doctor Management
- Patient Management
- Appointment Monitoring
- Analytics
- Working Hours Configuration
- Leave Management

---

## High-Level Architecture

```
                    React Frontend
                           │
                           ▼
                  Nginx Reverse Proxy
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼

 Backend API        Notification Service      LLM Service
      │                    │                    │
      │                    │                    │
      ▼                    ▼                    ▼

 Redis Locks        Email + Calendar      Groq LLM API

      │
      ▼

 Apache Kafka

      │

 Scheduler Service

      │

 PostgreSQL (AWS RDS)
```

---

# 🧩 Microservices

| Service | Responsibility |
|----------|----------------|
| Frontend | React Application |
| Backend | REST API & Business Logic |
| Notification Service | Email, Push Notification & Calendar |
| LLM Service | AI Summarization |
| Scheduler Service | Cron Jobs & Medication Reminders |
| Redis | Distributed Locking |
| Kafka | Event Broker |
| PostgreSQL | Persistent Storage |
| Nginx | Reverse Proxy |

---

# ⚙ Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication

## Database

- PostgreSQL (AWS RDS)

## Messaging

- Apache Kafka

## Caching

- Redis

## AI

- Groq API
- Llama 3.3 70B

## Notification

- Nodemailer
- Firebase Cloud Messaging

## Calendar

- Google Calendar API

## DevOps

- Docker
- Docker Compose
- Nginx
- AWS EC2

---

# 📂 Project Structure

```
healthcare-appointment-follow-up-manager

├── frontend
├── src (Backend API)
├── notification-service
├── llm-service
├── scheduler-service
├── nginx
├── docker-compose.yml
└── README.md
```

---

# 🔄 Appointment Workflow

```
Patient

↓

Search Doctor

↓

Select Slot

↓

Redis Lock

↓

Database Transaction

↓

Appointment Created

↓

Kafka Event Published

↓

Notification Service

↓

Google Calendar

↓

Email Notification

↓

LLM Summary Generated

↓

Doctor Dashboard
```

---

# 🤖 AI Integration

## Pre-Visit Summary

The patient submits symptoms while booking.

The LLM generates:

- Chief Complaint
- Urgency Level
- Symptom Summary
- Suggested Questions for Doctor

---

## Post-Visit Summary

The doctor submits:

- Clinical Notes
- Diagnosis
- Prescription

The LLM converts technical medical notes into an easy-to-understand patient summary including:

- Diagnosis
- Medication Instructions
- Lifestyle Advice
- Follow-up Recommendations

---

# 📬 Event Driven Architecture

The platform uses Apache Kafka for asynchronous communication.

```
Appointment Booked

↓

Kafka Topic

↓

Notification Worker

↓

Email

↓

Calendar

↓

Push Notification

↓

LLM Worker

↓

AI Summary
```

This architecture decouples services and improves scalability.

---

# 🔒 Double Booking Prevention

The system prevents simultaneous bookings using:

- Redis Distributed Locks
- Database Transactions
- Atomic Slot Reservation
- Slot Availability Validation

This guarantees consistency even under concurrent booking requests.

---

# 📅 Doctor Leave Management

When a doctor marks leave:

- Existing appointments are identified
- Kafka publishes leave events
- Notification Service sends emails
- Google Calendar events are updated
- Patients receive rescheduling notifications

---

# ⏰ Background Scheduler

Scheduler Service periodically executes:

- Medication reminders
- Failed notification retries
- Appointment reminders
- Cleanup jobs

---

# 📦 Deployment Architecture

```
Internet

↓

AWS EC2

↓

Nginx Reverse Proxy

↓

Docker Compose

├── Frontend
├── Backend
├── Notification Service
├── LLM Service
├── Scheduler Service
├── Redis
└── Kafka

↓

AWS RDS PostgreSQL
```

---

# 🐳 Dockerized Services

| Container | Description |
|------------|-------------|
| frontend | React UI |
| backend | REST API |
| notification-service | Notification Worker |
| llm-service | AI Worker |
| scheduler-service | Cron Scheduler |
| nginx | Reverse Proxy |
| kafka | Event Streaming |
| redis | Distributed Lock |

---

# 🔑 Environment Variables

Create the following `.env` files before running locally.

Backend

```
DATABASE_URL=

JWT_SECRET=

REDIS_URL=

KAFKA_BROKER=
```

Notification Service

```
DATABASE_URL=

GMAIL_USER=

GMAIL_APP_PASSWORD=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=
```

LLM Service

```
GROQ_API_KEY=

GROQ_MODEL=
```

---

# ▶ Running Locally

Clone Repository

```bash
git clone https://github.com/Adi19052005/healthcare-appointment-follow-up-manager

cd healthcare-appointment-follow-up-manager
```

Build Containers

```bash
docker compose build
```

Run

```bash
docker compose up -d
```

Application

```
http://localhost
```

---

# 📖 API Overview

Authentication

```
POST /api/auth/login
POST /api/auth/register
```

Appointments

```
POST /api/appointments
GET /api/appointments/my
PATCH /api/appointments/:id/cancel
PATCH /api/appointments/:id/reschedule
```

Doctors

```
GET /api/doctors
GET /api/doctors/:id
```

Patients

```
GET /api/patients/profile
```

Admin

```
GET /api/admin/dashboard
GET /api/admin/appointments
```

---

# 🚀 Future Improvements

- Kubernetes Deployment
- Horizontal Kafka Scaling
- Redis Sentinel
- WebSocket Notifications
- Prometheus & Grafana Monitoring
- OpenTelemetry Distributed Tracing
- SMS Notifications
- Multi-Clinic Support
- Audit Logging
- CI/CD using GitHub Actions

---

# 📄 Assignment Mapping

| Requirement | Status |
|-------------|--------|
| Patient Portal | ✅ |
| Doctor Portal | ✅ |
| Admin Portal | ✅ |
| JWT Authentication | ✅ |
| AI Pre-Visit Summary | ✅ |
| AI Post-Visit Summary | ✅ |
| Medication Reminder | ✅ |
| Email Notification | ✅ |
| Google Calendar Integration | ✅ |
| Redis Slot Locking | ✅ |
| Kafka Event Streaming | ✅ |
| Docker Deployment | ✅ |
| AWS EC2 Deployment | ✅ |
| PostgreSQL (AWS RDS) | ✅ |

---

# 👨‍💻 Author

**Aditya Solunke**

B.Tech Computer Science & Artificial Intelligence

Vishwakarma Institute of Technology, Pune

GitHub: https://github.com/Adi19052005

---

## ⭐ If you found this project interesting, consider giving it a Star!
