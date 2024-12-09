import { createElement, type FunctionComponent } from 'react';

/**
 * Creates a rendering function for a PDF document.
 *
 * Designed so that this would live in a separate file that
 * is not bundled with the main application so that
 * we can use it in a Web Worker.
 * This causes the component file and this file to be bundled
 * separately, which is important for Web Workers.
 *
 * @example
 *
 * ```tsx
 * import { CreatePdfRenderer } from './CreatePdfRenderer';
 *
 * const MyPdfRenderer = CreatePdfRenderer(({ name }) => (
 *  <Document>
 *   <Page>
 *   <Text>{name}</Text>
 *  </Page>
 * </Document>
 * ));
 * ```
 *
 * in a file designed to be bundled as a Web Worker:
 *
 * ```tsx
 * import { CreatePdfWorker } from './CreatePdfWorker';
 * import { MyPdfRenderer } from './MyPdfRenderer';
 *
 * CreatePdfWorker(MyPdfRenderer);
 * ```
 *
 * This will wire up the renderer to be used in a Web Worker and
 * via comlink we can call the renderPdf function from the main
 * application.
 *
 * If you want, we can also use our renderer in the main application.
 */
export function CreatePdfRenderer<T extends object>(
  Component: FunctionComponent<T>
) {
  async function renderPdf(props: T) {
    const { pdf } = await import('@react-pdf/renderer');
    const component = createElement(Component, props);
    return pdf(component).toBlob();
  }

  return {
    renderPdf,
  };
}
