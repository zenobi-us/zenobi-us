import { useMemo, type ComponentProps } from 'react';

import { Drawer, type DrawerContent } from './Drawer';

type DrawerProps = ComponentProps<typeof Drawer>;
type DrawerContentProps = ComponentProps<typeof DrawerContent>;
type SimpleDrawerProps = DrawerProps &
  DrawerContentProps & {
    trigger: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
  };

export function SimpleDrawer({
  anchor = 'bottomright',
  tone = 'primary',
  rounded,
  trigger,
  children,
  ...drawerProps
}: SimpleDrawerProps) {
  const direction = useMemo((): DrawerProps['direction'] => {
    if (anchor.startsWith('top')) {
      return 'top';
    }
    if (anchor.startsWith('bottom')) {
      return 'bottom';
    }
    if (anchor === 'left' || anchor === 'right') {
      return anchor;
    }
    return 'bottom';
  }, [anchor]);

  return (
    <Drawer
      repositionInputs={false}
      direction={direction}
      {...drawerProps}
    >
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Overlay>
        <Drawer.Content
          anchor={anchor}
          tone={tone}
          rounded={rounded}
        >
          {children}
        </Drawer.Content>
      </Drawer.Overlay>
    </Drawer>
  );
}
