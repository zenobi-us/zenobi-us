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
  base: ['drawer-amchored'],
  variants: {
    anchor: {
      bottomleft: ['bottom-0 w-full flex flex-col justify-end items-start'],
      bottomright: ['bottom-0 w-full flex flex-col justify-end items-end'],
      bottom: ['bottom-0 w-full flex flex-col justify-end items-center'],
      topleft: ['top-0 w-full flex flex-col justify-start items-start'],
      topright: ['top-0 w-full flex flex-col justify-start items-end'],
      top: ['top-0 w-full flex flex-col justify-start items-center'],

      left: [
        'top-0 left-0 h-full w-full flex flex-col justify-center items-start',
      ],
      right: [
        'top-0 right-0 h-full w-full flex flex-col justify-center items-end',
      ],
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
      className={cn('drawer-overlay fixed inset-0 z-50 bg-black/80', className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContentStyles = tv({
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

const DrawerContent = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> &
    VariantProps<typeof DrawerFrameStyles> &
    VariantProps<typeof DrawerAnchorStyles> &
    VariantProps<typeof DrawerContentStyles>
>(({ className, children, anchor, tone, rounded, padding, ...props }, ref) => {
  const styles = DrawerAnchorStyles({ anchor });
  const paddingStyles = DrawerContentStyles({ padding });
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <Box className={cn('drawer-content fixed z-50', styles, paddingStyles)}>
        <DrawerPrimitive.Content
          ref={ref}
          {...props}
        >
          <DrawerFrame
            tone={tone}
            rounded={rounded}
            className={className}
            {...props}
          >
            {anchor.startsWith('bottom') && (
              <div className="mx-auto mt-1 h-2 w-[100px] rounded-full bg-background-shadow" />
            )}
            {anchor.startsWith('top') && (
              <div className="mx-auto mb-1 h-2 w-[100px] rounded-full bg-background-shadow" />
            )}
            {children}
          </DrawerFrame>
        </DrawerPrimitive.Content>
      </Box>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

const DrawerFrameStyles = tv({
  base: [
    'drawer-frame bg-background shadow-lg',
    'max-w-full ',
    'flex flex-col',
  ],
  variants: {
    tone: {
      primary: ['text-text-base bg-background-overlay'],
    },
    rounded: { true: ['rounded-t-[10px] rounded-b-[10px]'] },
  },
  defaultVariants: {
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
    className={cn(
      'drawer-header grid gap-1.5 p-4 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('drawer-body mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
DrawerBody.displayName = 'DrawerBody';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('drawer-footer mt-auto flex flex-col gap-2 p-4', className)}
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
      'drawer-title',
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
    className={cn('drawer-description text-sm text-text-muted', className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

Drawer.Overlay = DrawerOverlay;
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
