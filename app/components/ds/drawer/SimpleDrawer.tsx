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
  className,
  tone = 'primary',
  rounded,
  size = 'md',
  trigger,
  title,
  description,
  footer,
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
      direction={direction}
      {...drawerProps}
    >
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Overlay>
        <Drawer.Content
          anchor={anchor}
          className={className}
          tone={tone}
          rounded={rounded}
          size={size}
        >
          <Drawer.Header>
            {title && <Drawer.Title>{title}</Drawer.Title>}
            {description && (
              <Drawer.Description>{description}</Drawer.Description>
            )}
          </Drawer.Header>
          <Drawer.Body>{children}</Drawer.Body>
          {footer && <Drawer.Footer>{footer}</Drawer.Footer>}
        </Drawer.Content>
      </Drawer.Overlay>
    </Drawer>
  );
}
