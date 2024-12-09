import { createContext } from 'react';
import type { HTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

type IdentifiedPath = {
  pathId: string;
};

const SiteContext = createContext({ pathId: '' });

// export const block = style({
//   ...Tokens.typeface.Base,
//   color: Tokens.palette.text.base,

//   minHeight: '100vh',
// });

const SiteStyles = tv({
  base: [
    'flex flex-col min-h-screen',
    'font-serif',
    'text-text-base bg-background-base',
  ],
});

const Site = ({
  children,
  className,
  pathId,
  ...props
}: HTMLAttributes<HTMLDivElement> & IdentifiedPath) => {
  const styles = SiteStyles();

  return (
    <SiteContext.Provider value={{ pathId }}>
      <div
        className={classnames('site', styles, className)}
        {...props}
      >
        {children}
      </div>
    </SiteContext.Provider>
  );
};

const SiteMainStyles = tv({
  base: ['flex flex-grow flex-col', 'w-full max-w-screen-md', 'mx-auto'],
});

const Main = function ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const styles = SiteMainStyles();
  return (
    <main
      className={classnames('site__main', styles, className)}
      {...props}
    >
      {children}
    </main>
  );
};

// export const header = style({
//   paddingLeft: Tokens.spacing.Normal,
//   paddingRight: Tokens.spacing.Normal,
//   zIndex: 1000,
//   top: 0,
//   position: 'sticky',
//   backgroundColor: Tokens.palette.background.base,
//   // backdropFilter: 'saturate(180%) blur(5px)',
//   boxShadow: `0 0 20px 20px ${Tokens.palette.background.base}`,

//   margin: '0 auto',
//   width: '100%',
//   maxWidth: Breakpoints.tablet,

//   '@media': {
//     print: {
//       display: 'none',
//     },
//   },
// });

const SiteHeaderStyles = tv({
  base: [
    'flex flex-col',
    'px-2 py-2 z-50 top-0 sticky',
    'bg-background-base',
    'shadow-[0_0_20px_20px_hsla(var(--twc-background-base))]',
    'm-auto w-full',
    'max-w-screen-md',
    'print:hidden',
  ],
});

const Header = function ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  const styles = SiteHeaderStyles();
  return (
    <header
      className={classnames('site__header', styles, className)}
      {...props}
    >
      {children}
    </header>
  );
};

const SiteFooterStyles = tv({
  base: ['flex flex-col', 'max-w-screen-md w-full', 'mx-auto'],
});

const Footer = function ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  const styles = SiteFooterStyles();

  return (
    <footer
      className={classnames('site__footer', styles, className)}
      {...props}
    >
      {children}
    </footer>
  );
};

Site.Main = Main;
Site.Header = Header;
Site.Footer = Footer;

export { Site, Main, Footer, Header };
