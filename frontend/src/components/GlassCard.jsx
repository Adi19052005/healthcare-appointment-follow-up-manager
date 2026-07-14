import { motion } from "framer-motion";
import Card from './ui/Card';

export default function GlassCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
    >
      <Card className={`bg-canvas-soft/80 border-transparent shadow-sm ${className}`}>
        {children}
      </Card>
    </motion.div>
  );
}
