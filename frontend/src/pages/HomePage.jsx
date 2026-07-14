import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  CalendarDays,
  HeartPulse,
  BrainCircuit,
  ArrowRight,
  Users,
  Stethoscope,
  CheckCircle2,
  BellRing,
  Activity,
} from "lucide-react";

export default function HomePage() {

  return (

    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.15),_transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)] text-white">

      {/* Background Blur */}

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* ================= Navbar ================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <motion.div

            initial={{ opacity: 0, x: -20 }}

            animate={{ opacity: 1, x: 0 }}

            className="flex items-center gap-4"

          >

           

              <div className="rounded-3xl bg-cyan-500/20 p-3">
  <HeartPulse
    className="text-cyan-300"
    size={28}
  />
</div>

<div>
              <h1 className="text-2xl font-bold">

                CareFlow

              </h1>

              <p className="text-xs tracking-[0.35em] uppercase text-cyan-300">

                Healthcare Platform

              </p>

            </div>

          </motion.div>

          <nav className="hidden gap-8 text-sm text-slate-300 lg:flex">

            <a href="#features" className="hover:text-cyan-300">

              Features

            </a>

            <a href="#workflow" className="hover:text-cyan-300">

              Workflow

            </a>

            <a href="#roles" className="hover:text-cyan-300">

              Roles

            </a>

            <a href="#architecture" className="hover:text-cyan-300">

              Architecture

            </a>

          </nav>

          <div className="flex gap-3">

            <Link

              to="/login"

              className="rounded-2xl border border-white/10 px-5 py-3 text-sm hover:bg-white/10"

            >

              Login

            </Link>

            <Link

              to="/register"

              className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"

            >

              Register

            </Link>

          </div>

        </div>

      </header>

      {/* ================= Hero ================= */}

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2">

        {/* Left */}

        <motion.div

          initial={{ opacity: 0, y: 30 }}

          animate={{ opacity: 1, y: 0 }}

        >

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

            <ShieldCheck size={18} />

            Secure AI-Powered Healthcare

          </div>

          <h1 className="text-5xl font-black leading-tight lg:text-6xl">

            Smarter Healthcare

            <br />

            Starts with

            <span className="text-cyan-300">

              {" "}CareFlow

            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">

            A cloud-native Healthcare Appointment Management System

            powered by AI, Kafka, Redis, PostgreSQL,

            AWS, and Claude to deliver seamless

            appointment booking, intelligent clinical

            summaries, and automated patient care.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link

              to="/register"

              className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400"

            >

              Get Started

              <ArrowRight size={18} />

            </Link>

            <Link

              to="/login"

              className="rounded-2xl border border-white/10 px-7 py-4 hover:bg-white/10"

            >

              Login

            </Link>

          </div>

          <div className="mt-12 flex flex-wrap gap-6">

            <div className="flex items-center gap-3">

              <BrainCircuit className="text-cyan-300" />

              <span>AI Summaries</span>

            </div>

            <div className="flex items-center gap-3">

              <BellRing className="text-cyan-300" />

              <span>Smart Notifications</span>

            </div>

            <div className="flex items-center gap-3">

              <CalendarDays className="text-cyan-300" />

              <span>Appointment Scheduling</span>

            </div>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div

          initial={{ opacity: 0, x: 40 }}

          animate={{ opacity: 1, x: 0 }}

          className="flex items-center justify-center"

        >

          <div className="w-full rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-sm text-cyan-300">

                  Live Platform

                </p>

                <h2 className="text-2xl font-bold">

                  System Status

                </h2>

              </div>

              <Activity

                className="text-green-400"

                size={36}

              />

            </div>

            {[
              "JWT Authentication",
              "Redis Distributed Locking",
              "Apache Kafka Messaging",
              "PostgreSQL + Prisma",
              "Claude AI Summaries",
              "Google Calendar Integration",
              "Email Notifications",
              "AWS RDS Deployment"
            ].map((item) => (

              <div

                key={item}

                className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4"

              >

                <span>{item}</span>

                <span className="text-green-400">

                  ● Online

                </span>

              </div>

            ))}

          </div>

        </motion.div>

      </section>
            {/* ================= Features ================= */}

      <section

        id="features"

        className="mx-auto max-w-7xl px-6 py-20"

      >

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="mb-14 text-center"

        >

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

            Why CareFlow

          </span>

          <h2 className="mt-6 text-4xl font-bold">

            Everything Needed For Modern Healthcare

          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-400">

            CareFlow combines AI, cloud infrastructure,

            distributed systems and intuitive workflows

            into one unified healthcare platform.

          </p>

        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[

            {

              icon: CalendarDays,

              title: "Smart Appointment Booking",

              desc:

                "Book, cancel and reschedule appointments instantly while Redis prevents double booking."

            },

            {

              icon: BrainCircuit,

              title: "AI Pre-Visit Summary",

              desc:

                "Patient intake is analysed using Claude AI to generate concise clinical summaries."

            },

            {

              icon: BellRing,

              title: "Automated Notifications",

              desc:

                "Kafka powered notification workers send reminders through Email and Google Calendar."

            },

            {

              icon: ShieldCheck,

              title: "Enterprise Security",

              desc:

                "JWT Authentication, RBAC, Prisma ORM and PostgreSQL ensure secure healthcare operations."

            }

          ].map((feature, index) => (

            <motion.div

              key={feature.title}

              initial={{ opacity: 0, y: 30 }}

              whileInView={{ opacity: 1, y: 0 }}

              transition={{ delay: index * 0.1 }}

              viewport={{ once: true }}

              whileHover={{

                y: -8,

                scale: 1.02

              }}

              className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl"

            >

              <div className="inline-flex rounded-2xl bg-cyan-500/20 p-4">

                <feature.icon

                  size={28}

                  className="text-cyan-300"

                />

              </div>

              <h3 className="mt-6 text-xl font-semibold">

                {feature.title}

              </h3>

              <p className="mt-4 leading-7 text-slate-400">

                {feature.desc}

              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* ================= AI Workflow ================= */}

      <section

        id="workflow"

        className="mx-auto max-w-7xl px-6 py-20"

      >

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="mb-16 text-center"

        >

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

            AI Workflow

          </span>

          <h2 className="mt-6 text-4xl font-bold">

            Intelligent Appointment Lifecycle

          </h2>

        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">

          {[

            {

              step: "01",

              title: "Patient Books",

              color: "bg-cyan-500"

            },

            {

              step: "02",

              title: "Intake Submitted",

              color: "bg-sky-500"

            },

            {

              step: "03",

              title: "Kafka Event",

              color: "bg-indigo-500"

            },

            {

              step: "04",

              title: "Claude AI Summary",

              color: "bg-purple-500"

            },

            {

              step: "05",

              title: "Doctor Reviews",

              color: "bg-green-500"

            }

          ].map((step, index) => (

            <motion.div

              key={step.step}

              initial={{ opacity: 0, y: 20 }}

              whileInView={{ opacity: 1, y: 0 }}

              transition={{ delay: index * 0.1 }}

              viewport={{ once: true }}

              className="relative rounded-3xl border border-white/10 bg-white/5 p-7 text-center"

            >

              <div

                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${step.color} font-bold text-black`}

              >

                {step.step}

              </div>

              <h3 className="mt-6 font-semibold">

                {step.title}

              </h3>

            </motion.div>

          ))}

        </div>

      </section>

      {/* ================= Architecture ================= */}

      <section

        id="architecture"

        className="mx-auto max-w-7xl px-6 py-20"

      >

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="mb-16 text-center"

        >

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

            Cloud Native Architecture

          </span>

          <h2 className="mt-6 text-4xl font-bold">

            Built Using Modern Distributed Systems

          </h2>

        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[

            {

              title: "Redis",

              subtitle: "Distributed Locking"

            },

            {

              title: "Kafka",

              subtitle: "Asynchronous Messaging"

            },

            {

              title: "PostgreSQL",

              subtitle: "Persistent Database"

            },

            {

              title: "AWS RDS",

              subtitle: "Managed Cloud Database"

            },

            {

              title: "Prisma",

              subtitle: "Type Safe ORM"

            },

            {

              title: "Claude AI",

              subtitle: "Clinical Summaries"

            },

            {

              title: "Google Calendar",

              subtitle: "Scheduling"

            },

            {

              title: "SendGrid",

              subtitle: "Notifications"

            }

          ].map((service, index) => (

            <motion.div

              key={service.title}

              initial={{ opacity: 0, scale: 0.9 }}

              whileInView={{ opacity: 1, scale: 1 }}

              transition={{ delay: index * 0.08 }}

              viewport={{ once: true }}

              whileHover={{ y: -6 }}

              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

            >

              <div className="text-2xl font-bold text-cyan-300">

                {service.title}

              </div>

              <p className="mt-3 text-slate-400">

                {service.subtitle}

              </p>

            </motion.div>

          ))}

        </div>

      </section>
            {/* ================= Roles ================= */}

      <section

        id="roles"

        className="mx-auto max-w-7xl px-6 py-20"

      >

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="mb-16 text-center"

        >

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

            User Roles

          </span>

          <h2 className="mt-6 text-4xl font-bold">

            Designed For Everyone In Healthcare

          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-400">

            Every user receives a personalized dashboard with
            workflows built specifically for their responsibilities.

          </p>

        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">

          {[

            {

              title: "Patient",

              icon: HeartPulse,

              color: "text-cyan-300",

              bg: "bg-cyan-500/20",

              features: [

                "Book appointments",

                "AI pre-visit summary",

                "Medical history",

                "Prescriptions",

                "Follow-up notifications"

              ]

            },

            {

              title: "Doctor",

              icon: Stethoscope,

              color: "text-fuchsia-300",

              bg: "bg-fuchsia-500/20",

              features: [

                "Today's appointments",

                "Clinical notes",

                "AI patient summary",

                "Digital prescriptions",

                "Leave management"

              ]

            },

            {

              title: "Administrator",

              icon: ShieldCheck,

              color: "text-amber-300",

              bg: "bg-amber-500/20",

              features: [

                "Doctor management",

                "Patient management",

                "Appointment analytics",

                "System monitoring",

                "Platform configuration"

              ]

            }

          ].map((role,index)=>(

            <motion.div

              key={role.title}

              initial={{ opacity:0,y:30 }}

              whileInView={{ opacity:1,y:0 }}

              transition={{ delay:index*0.15 }}

              viewport={{ once:true }}

              whileHover={{

                y:-10,

                scale:1.02

              }}

              className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"

            >

              <div className={`inline-flex rounded-3xl p-4 ${role.bg}`}>

                <role.icon

                  size={32}

                  className={role.color}

                />

              </div>

              <h3 className="mt-6 text-2xl font-bold">

                {role.title}

              </h3>

              <div className="mt-8 space-y-4">

                {

                  role.features.map(feature=>(

                    <div

                      key={feature}

                      className="flex items-center gap-3"

                    >

                      <CheckCircle2

                        size={18}

                        className="text-green-400"

                      />

                      <span className="text-slate-300">

                        {feature}

                      </span>

                    </div>

                  ))

                }

              </div>

            </motion.div>

          ))}

        </div>

      </section>

      {/* ================= Statistics ================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[

            {

              value:"99.9%",

              label:"Platform Availability"

            },

            {

              value:"<100ms",

              label:"Average API Response"

            },

            {

              value:"8",

              label:"Cloud Microservices"

            },

            {

              value:"24/7",

              label:"Healthcare Monitoring"

            }

          ].map((item,index)=>(

            <motion.div

              key={item.label}

              initial={{ opacity:0,scale:0.9 }}

              whileInView={{ opacity:1,scale:1 }}

              transition={{ delay:index*0.1 }}

              viewport={{ once:true }}

              className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-8 text-center backdrop-blur-xl"

            >

              <h3 className="text-5xl font-black text-cyan-300">

                {item.value}

              </h3>

              <p className="mt-3 text-slate-300">

                {item.label}

              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* ================= Why CareFlow ================= */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <motion.div

          initial={{ opacity:0,y:20 }}

          whileInView={{ opacity:1,y:0 }}

          viewport={{ once:true }}

          className="rounded-[40px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-slate-900/50 to-indigo-500/10 p-12 backdrop-blur-xl"

        >

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

                Why Choose CareFlow

              </span>

              <h2 className="mt-6 text-4xl font-bold">

                More Than Just An Appointment System

              </h2>

              <p className="mt-8 leading-8 text-slate-300">

                CareFlow is built using modern cloud-native
                architecture and event-driven design.

                By combining Kafka, Redis, PostgreSQL,
                Prisma, AWS, Claude AI and Google Calendar,
                the platform delivers fast, secure and
                intelligent healthcare workflows.

              </p>

            </div>

            <div className="space-y-5">

              {[

                "Distributed locking with Redis",

                "Event-driven communication using Kafka",

                "AI-powered clinical summaries",

                "Real-time notification workers",

                "Secure JWT authentication",

                "Cloud-hosted PostgreSQL on AWS RDS"

              ].map(item=>(

                <div

                  key={item}

                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5"

                >

                  <CheckCircle2

                    className="text-green-400"

                    size={22}

                  />

                  <span>

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </motion.div>

      </section>
            {/* ================= Final CTA ================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <motion.div

          initial={{ opacity:0, y:20 }}

          whileInView={{ opacity:1, y:0 }}

          viewport={{ once:true }}

          className="rounded-[40px] border border-cyan-500/20 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20 p-12 text-center backdrop-blur-xl"

        >

          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

            Ready To Experience Smarter Healthcare?

          </span>

          <h2 className="mt-8 text-5xl font-black">

            Join CareFlow Today

          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">

            Book appointments,

            receive AI-powered pre-visit summaries,

            collaborate with doctors,

            and experience the next generation of

            intelligent healthcare management.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link

              to="/register"

              className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-400"

            >

              Create Patient Account

              <ArrowRight size={20}/>

            </Link>

            <Link

              to="/login"

              className="rounded-2xl border border-white/10 px-8 py-4 transition hover:bg-white/10"

            >

              Login

            </Link>

          </div>

        </motion.div>

      </section>

      {/* ================= Footer ================= */}

      <footer className="border-t border-white/10 bg-slate-950/40 backdrop-blur-xl">

        <div className="mx-auto max-w-7xl px-6 py-14">

          <div className="grid gap-10 lg:grid-cols-4">

            {/* Logo */}

            <div>

              <div className="flex items-center gap-3">

                <div className="rounded-2xl bg-cyan-500/20 p-3">

                  <HeartPulse

                    className="text-cyan-300"

                    size={24}

                  />

                </div>

                <div>

                  <h3 className="text-2xl font-bold">

                    CareFlow

                  </h3>

                  <p className="text-xs tracking-[0.3em] uppercase text-cyan-300">

                    Healthcare Platform

                  </p>

                </div>

              </div>

              <p className="mt-6 text-sm leading-7 text-slate-400">

                Intelligent Healthcare Appointment

                Management powered by AI,

                Event-Driven Architecture,

                Cloud Computing,

                and Distributed Systems.

              </p>

            </div>

            {/* Features */}

            <div>

              <h4 className="mb-5 text-lg font-semibold">

                Platform

              </h4>

              <div className="space-y-3 text-slate-400">

                <p>Appointment Booking</p>

                <p>AI Healthcare Summary</p>

                <p>Medical Records</p>

                <p>Digital Prescriptions</p>

                <p>Healthcare Analytics</p>

              </div>

            </div>

            {/* Technology */}

            <div>

              <h4 className="mb-5 text-lg font-semibold">

                Technology

              </h4>

              <div className="flex flex-wrap gap-3">

                {[

                  "React",

                  "Node.js",

                  "Express",

                  "Kafka",

                  "Redis",

                  "Prisma",

                  "PostgreSQL",

                  "AWS",

                  "Claude AI"

                ].map((tech)=>(

                  <span

                    key={tech}

                    className="rounded-full bg-white/5 px-4 py-2 text-sm"

                  >

                    {tech}

                  </span>

                ))}

              </div>

            </div>

            {/* Security */}

            <div>

              <h4 className="mb-5 text-lg font-semibold">

                Security

              </h4>

              <div className="space-y-3 text-slate-400">

                <p>JWT Authentication</p>

                <p>Role Based Access</p>

                <p>Redis Distributed Locking</p>

                <p>Encrypted Database</p>

                <p>Secure Cloud Deployment</p>

              </div>

            </div>

          </div>

          <div className="mt-12 border-t border-white/10 pt-8">

            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

              <p className="text-sm text-slate-500">

                © {new Date().getFullYear()} CareFlow.

                All Rights Reserved.

              </p>

              <div className="flex flex-wrap justify-center gap-3">

                {[

                  "AI Powered",

                  "Cloud Native",

                  "Kafka",

                  "Redis",

                  "PostgreSQL",

                  "AWS RDS"

                ].map((item)=>(

                  <span

                    key={item}

                    className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-300"

                  >

                    {item}

                  </span>

                ))}

              </div>

            </div>

          </div>

        </div>

      </footer>

    </div>

  );

}