import { AnimatePresence, motion } from 'framer-motion';

import { Loader } from './Loader';

export function FullScreenLoader({
  loading,
  label = 'Loading...',
  children,
}: {
  loading: boolean;
  label?: string;
  className?: string;
  children: () => JSX.Element;
}) {
  return (
    <AnimatePresence
      initial={true}
      mode="popLayout"
    >
      {loading && (
        <motion.div
          data-testid="fullscreen-loader"
          className="flex flex-col flex-grow"
          key="loader"
        >
          <Loader
            label={label}
            size="sm"
          />
        </motion.div>
      )}
      {!loading && (
        <motion.div
          data-testid="fullscreen-loader-resolved"
          className="flex flex-grow"
          key="content"
          variants={{
            start: { opacity: 0 },
            end: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          transition={{ duration: 1 }}
          initial="start"
          animate="end"
          exit="exit"
        >
          {children()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
