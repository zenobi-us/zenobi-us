import { useLocation, useOutlet } from '@remix-run/react';
import { motion } from 'framer-motion';

export default function MeRoute() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {outlet}
    </motion.div>
  );
}
