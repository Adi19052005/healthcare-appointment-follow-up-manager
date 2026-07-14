import { motion } from "framer-motion";
import Card from './ui/Card';

export default function PageHeader({ title, subtitle, icon: Icon, accent = "text-cyan-300", action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="sticky top-0 z-20 mb-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            {Icon ? (
              <div className="rounded-2xl bg-white/10 p-3">
                <Icon className={accent} size={22} />
              </div>
            ) : null}
            <div>
              <h2 className="text-2xl font-semibold text-white">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
            </div>
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </Card>
    </motion.div>
  );
}
