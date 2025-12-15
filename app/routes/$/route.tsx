import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { tv, type VariantProps } from 'tailwind-variants';
import { motion } from 'framer-motion';

import { Page } from '~/components/ds/page/Page';
import { Box } from '~/components/ds/box/Box';
import { classnames } from '~/core/classnames';
import { createSiteMeta } from '~/services/Meta/createSiteMeta';

const ErrorContainerStyles = tv({
  slots: {
    root: [
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-screen',
      'gap-6',
      'px-4',
    ],
    heading: [
      'text-8xl',
      'font-bold',
      'text-text-link',
      'mb-4',
    ],
    message: [
      'text-xl',
      'text-text-muted',
      'text-center',
      'max-w-md',
      'mb-2',
    ],
    subtext: [
      'text-base',
      'text-text-muted',
      'text-center',
      'mb-6',
    ],
    linkContainer: [
      'mt-4',
    ],
  },
  variants: {
    variant: {
      default: {},
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const meta: MetaFunction = () => {
  return [
    ...createSiteMeta({
      description:
        'The page you are looking for could not be found.',
    }),
    { name: 'robots', content: 'noindex' },
  ];
};

export default function NotFoundRoute() {
  const styles = ErrorContainerStyles();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <Page>
      <Page.Block direction="column">
        <motion.div
          className={classnames(styles.root())}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className={classnames(styles.heading())}
            custom={0}
            variants={itemVariants}
          >
            404
          </motion.h1>

          <motion.p
            className={classnames(styles.message())}
            custom={0.1}
            variants={itemVariants}
          >
            Page Not Found
          </motion.p>

          <motion.p
            className={classnames(styles.subtext())}
            custom={0.2}
            variants={itemVariants}
          >
            The page you are looking for could not be found or has been
            removed.
          </motion.p>

          <motion.div
            className={classnames(styles.linkContainer())}
            custom={0.3}
            variants={itemVariants}
          >
            <Box asChild className="text-text-link hover:text-text-strong transition-colors">
              <Link to="/">
                Return to Home
              </Link>
            </Box>
          </motion.div>
        </motion.div>
      </Page.Block>
    </Page>
  );
}
