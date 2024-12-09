import type { ComponentProps, ReactNode } from 'react';

import { Button } from '~/components/ds/button/Button';

import { PdfRenderer } from './Pdf';

export function PdfButton({
  label,
  content,
  getContent,
  ...props
}: {
  label: ReactNode;
  content?: string;
  getContent?: () => Promise<string>;
} & Omit<ComponentProps<typeof Button>, 'label'>) {
  const getHtml = async () => {
    if (typeof content === 'string') {
      return content;
    }

    if (typeof getContent === 'function') {
      return await getContent();
    }

    return '';
  };

  // react-pdf can't handle svg?
  const handleRenderPdf = async () => {
    const html = await getHtml();
    const blob = await PdfRenderer.renderPdf({ html });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <Button
      {...props}
      onClick={handleRenderPdf}
    >
      {label}
    </Button>
  );
}
