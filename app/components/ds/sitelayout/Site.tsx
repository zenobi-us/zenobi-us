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
        data-testid="site"
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
      data-testid="site-main"
      className={classnames('site__main', styles, className)}
      {...props}
    >
      {children}
    </main>
  );
};

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
      data-testid="site-header"
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
      data-testid="site-footer"
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
