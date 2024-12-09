import type { ComponentProps, ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import { Button } from '~/components/ds/button/Button';

export function ButtonWithFeedback({
  children,
  feedback,
  onClick,
  ...props
}: ComponentProps<typeof Button> & { feedback?: ReactNode }) {
  return (
    <Button
      secondary
      onClick={onClick}
      {...props}
    >
      <AnimatePresence
        mode="wait"
        initial={false}
      >
        <LayoutGroup>
          {feedback && (
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {feedback}
            </motion.div>
          )}
          {!feedback && (
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {children}
            </motion.div>
          )}
        </LayoutGroup>
      </AnimatePresence>
    </Button>
  );
}
