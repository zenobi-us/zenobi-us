import { z } from 'zod';
import type { ComponentProps } from 'react';
import { motion } from 'framer-motion';

export const LogoPropSchema = z.object({
  baseStroke: z.string().optional().default('#ffffff33'),
  fgFill: z.string().optional().default('transparent'),
  bgFill: z.string().optional().default('transparent'),
  arrowStroke: z.string().optional().default('currentColor'),
  fgStroke: z.string().optional().default('currentColor'),
  bgStroke: z.string().optional().default('currentColor'),
});
export type LogoProps = z.infer<typeof LogoPropSchema>;

export function Logo({
  fgFill,
  bgFill,
  arrowStroke,
  fgStroke,
  bgStroke,
  baseStroke,
  ...props
}: Partial<LogoProps> & ComponentProps<typeof motion.svg>) {
  const colors = LogoPropSchema.safeParse({
    fgFill,
    bgFill,
    arrowStroke,
    fgStroke,
    bgStroke,
    baseStroke,
  });

  if (!colors.success) {
    throw new Error('Invalid Logo props');
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={1.4142}
      viewBox="0 0 142 142"
      {...props}
    >
      <motion.path
        transform="matrix(1.0498 0 0 .95592 -3.4541 9.5884)"
        d="m17.783 22.263c-1.6168 2.3528-2.5629 5.2057-2.5629 8.2886v79.152c0 7.0439 8.9411 14.634 14.63 14.634h79.068c7.2575 0 14.63-7.7792 14.63-14.634v-79.152c0-3.0378-0.91364-5.8522-2.4851-8.185"
        fill="none"
        stroke={colors.data.baseStroke}
        strokeLinecap="round"
        strokeWidth={5.0023}
      />
      <rect
        x={15.22}
        y={15.925}
        width={108.33}
        height={108.41}
        rx={14.63}
        ry={14.63}
        fill={colors.data.bgFill}
        stroke={colors.data.bgStroke}
        strokeLinecap="round"
        strokeWidth={5}
      />
      <rect
        x={16.656}
        y={17.302}
        width={105.46}
        height={95.915}
        rx={14.63}
        ry={14.63}
        fill={colors.data.fgFill}
        stroke={colors.data.fgStroke}
        strokeLinecap="round"
        strokeWidth={5}
      />
      <g
        fill="none"
        stroke="#000"
        strokeLinecap="round"
      >
        <motion.path
          d="m69.36 50.123 27.062 27.381"
          strokeWidth={5}
          stroke={colors.data.arrowStroke}
        />
        <motion.path
          d="m42.298 77.504 27.062-27.381"
          strokeWidth={5}
          stroke={colors.data.arrowStroke}
        />
        <motion.path
          d="m69.36 54.368 27.062 23.136"
          strokeWidth={5.0011}
          stroke={colors.data.arrowStroke}
        />
        <motion.path
          d="m42.298 77.504 27.062-23.109"
          strokeWidth={5}
          stroke={colors.data.arrowStroke}
        />
      </g>
    </motion.svg>
  );
}
