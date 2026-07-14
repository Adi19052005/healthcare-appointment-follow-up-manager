import StatusBadge from "./StatusBadge";

export default function AppointmentCard({ appointment, onCancel, onReschedule }) {
  const scheduledDate = appointment?.appointmentDate || appointment?.date;
  const formattedDate = scheduledDate ? new Date(scheduledDate).toLocaleDateString() : "TBD";
  const formattedTime = appointment?.slotStartTime || appointment?.time || "TBD";

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{appointment?.doctor?.name || "Doctor"}</h3>
          <p className="mt-1 text-sm text-slate-400">{appointment?.symptoms || appointment?.reason || "Consultation"}</p>
        </div>
        <StatusBadge status={appointment?.status || "pending"} tone={appointment?.status === "COMPLETED" ? "success" : appointment?.status === "CANCELLED" ? "danger" : "info"} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
        <p>Scheduled: {formattedDate}</p>
        <p>Time: {formattedTime}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {onCancel ? (
          <button onClick={() => onCancel(appointment)} className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">Cancel</button>
        ) : null}
        {onReschedule ? (
          <button onClick={() => onReschedule(appointment)} className="rounded-2xl bg-cyan-500/20 px-3 py-2 text-sm text-cyan-300 transition hover:bg-cyan-500/30">Reschedule</button>
        ) : null}
      </div>
    </div>
  );
}
