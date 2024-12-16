import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
} from 'react';

import { Drawer, type DrawerContent } from './Drawer';

type DrawerProps = ComponentProps<typeof Drawer>;
type DrawerContentProps = ComponentProps<typeof DrawerContent>;
type SimpleDrawerProps = {
  trigger: React.ReactNode;
};

const SimpleDrawerContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function useSimpleDrawer() {
  const context = useContext(SimpleDrawerContext);
  if (context === null) {
    throw new Error(
      'useSimpleDrawer must be used within a SimpleDrawerProvider'
    );
  }
  return context;
}

export function SimpleDrawer({
  anchor = 'bottomright',
  tone = 'primary',
  rounded,
  trigger,
  children,
  ...drawerProps
}: DrawerProps & DrawerContentProps & SimpleDrawerProps) {
  const [open, setOpen] = useState(false);
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
    <SimpleDrawerContext.Provider value={{ open, setOpen }}>
      <Drawer
        open={open}
        repositionInputs={false}
        direction={direction}
        onClose={() => {
          setOpen(false);
        }}
        {...drawerProps}
      >
        <Drawer.Trigger
          onClick={() => {
            setOpen(!open);
          }}
          asChild
        >
          {trigger}
        </Drawer.Trigger>
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
    </SimpleDrawerContext.Provider>
  );
}
