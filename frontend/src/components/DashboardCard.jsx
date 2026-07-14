import { motion } from "framer-motion";
import Card from './ui/Card';

export default function DashboardCard({ title, value, subtitle, icon: Icon, accent = "from-cyan-500/20 to-blue-600/20", iconClassName = "text-cyan-300" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <h3 className="mt-4 text-3xl font-semibold text-white">{value}</h3>
            {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
          </div>
          <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3`}>
            {Icon ? <Icon className={iconClassName} size={22} /> : null}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
