import { AnimatePresence, motion } from 'framer-motion';

export function RoleCard({ role }: { role: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={role}
        initial={{
          y: 50,
          opacity: 0,
          scale: 0.8,
          color: 'hsl(var(--twc-text-muted))',
          display: 'inline-flex',
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
          color: 'hsl(var(--twc-text-positive))',
        }}
        exit={{
          y: -50,
          opacity: 0,
          scale: 0.8,
          width: '100%',
          filter: 'blur(5px)',
          color: 'hsl(var(--twc-text-muted))',
        }}
      >
        {role}
      </motion.span>
    </AnimatePresence>
  );
}
