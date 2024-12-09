import { useMemo, type HTMLAttributes } from 'react';
import { get } from 'lodash-es';
import * as Icons from '@radix-ui/react-icons';
import { tv, type VariantProps } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

// export const IconProperties = defineProperties({
//   properties: {
//     size: {
//       small: {
//         width: 20,
//         height: 20,
//       },
//       medium: {
//         width: 40,
//         height: 40,
//       },
//       large: {
//         width: 60,
//         height: 60,
//       },
//     },
//   },
// });

const Styles = tv({
  slots: {
    block: 'flex items-center',
    icon: 'flex',
    visuallyHidden: 'sr-only',
  },
  variants: {
    size: {
      small: 'w-5 h-5',
      medium: 'w-10 h-10',
      large: 'w-15 h-15',
    },
  },
});

type IconProps = VariantProps<typeof Styles> &
  HTMLAttributes<HTMLDivElement> & {
    label?: string;
    name: keyof typeof Icons;
  };

export const Icon = ({ className, label, name, ...props }: IconProps) => {
  const IconComponent = useMemo(() => {
    return get(Icons, name);
  }, [name]);

  const styles = Styles(props);

  return (
    <div className={classnames('icon', className, styles.block())}>
      <IconComponent
        className={styles.icon()}
        width=""
        height=""
      />
      {label && <span className={styles.visuallyHidden()}>{label}</span>}
    </div>
  );
};
