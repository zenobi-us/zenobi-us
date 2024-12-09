import { createContext, useContext, type PropsWithChildren } from 'react';

export type PdfViewMode = 'pdf' | 'browser';

export type WithPdfViewMode = {
  viewMode?: PdfViewMode;
};

const ViewModeContext = createContext<WithPdfViewMode>({
  viewMode: 'browser',
});
export function ViewModeProvider({
  viewMode,
  children,
}: PropsWithChildren<Partial<WithPdfViewMode>>) {
  return (
    <ViewModeContext.Provider value={{ viewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};

export function PdfOnly({ children }: PropsWithChildren) {
  const mode = useViewMode();
  if (mode?.viewMode !== 'pdf') {
    return null;
  }

  return <>{children}</>;
}

export function PrintOnly({ children }: PropsWithChildren) {
  return <span className="hidden print:block">{children}</span>;
}

export function BrowserOnly({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <span className={`${className || 'block'} print:hidden`}>{children}</span>
  );
}
