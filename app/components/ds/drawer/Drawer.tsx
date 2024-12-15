import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Drawer as DrawerPrimitive } from 'vaul';

import { classnames } from '~/core/classnames';

import { Box } from '../box/Box';

const cn = classnames;

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;
const Drawer = ({ shouldScaleBackground = true, ...props }: DrawerProps) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerAnchorStyles = tv({
  base: 'drawer-anchored top-0 bottom-0 left-0 right-0 flex flex-col max-h-screen',
  variants: {
    anchor: {
      bottomleft: ['justify-end items-start'],
      bottomright: ['justify-end items-end'],
      bottom: ['justify-end items-center'],
      topleft: ['justify-start items-start'],
      topright: ['justify-start items-end'],
      top: ['justify-start items-center'],
      left: ['justify-center items-start'],
      right: ['justify-center items-end'],
    },
  },
  defaultVariants: {
    anchor: 'bottomright',
  },
});

const DrawerOverlay = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> &
    VariantProps<typeof DrawerAnchorStyles>
>(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/40', className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> &
    VariantProps<typeof DrawerFrameStyles> &
    VariantProps<typeof DrawerAnchorStyles>
>(({ className, children, anchor, tone, rounded, size, ...props }, ref) => {
  const styles = DrawerAnchorStyles({ anchor });

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Box className={cn('fixed z-50 ', styles, className)}>
        <DrawerPrimitive.Content
          ref={ref}
          {...props}
        >
          <DrawerFrame
            tone={tone}
            rounded={rounded}
            size={size}
            className={cn('overflow-y-auto max-h-screen', className)}
            {...props}
          >
            <DrawerHandle
              edge={(anchor.startsWith('bottom') && 'top') || 'bottom'}
            />

            {children}
          </DrawerFrame>
        </DrawerPrimitive.Content>
      </Box>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

const DrawerFrameStyles = tv({
  base: ['bg-background-base shadow-lg', 'max-w-full ', 'flex flex-col'],
  variants: {
    tone: {
      primary: ['text-text-base bg-background-overlay'],
    },
    rounded: { true: ['rounded-t-[10px] rounded-b-[10px]'] },
    size: {
      sm: ['w-full md:w-[320px]'],
      md: ['w-full md:w-[480px]'],
      lg: ['w-full md:w-[640px]'],
      xl: ['w-full md:w-[800px]'],
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'primary',
    rounded: true,
  },
});

const DrawerFrame = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof DrawerFrameStyles>) => {
  const styles = DrawerFrameStyles(props);
  return (
    <div
      className={cn(styles, className)}
      {...props}
    />
  );
};
DrawerFrame.displayName = 'DrawerFrame';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
DrawerBody.displayName = 'DrawerBody';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-text-muted', className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

function DrawerHandle({ edge }: { edge: 'top' | 'bottom' }) {
  return (
    <div
      className="mx-auto p-4 cursor-grab"
      data-edge={edge}
    >
      <DrawerPrimitive.Handle className="h-2 w-[100px] rounded-full bg-background-shadow/45" />
    </div>
  );
}

Drawer.Overlay = DrawerOverlay;
Drawer.Handle = DrawerHandle;
Drawer.Trigger = DrawerTrigger;
Drawer.Close = DrawerClose;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.Portal = DrawerPortal;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
