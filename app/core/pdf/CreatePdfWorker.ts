import './workerShim';
import { expose } from 'comlink';

import type { PdfRenderFactory } from './types';

let error = console.error;

export function createPdfWorker<T extends object>(
  RenderFactory: PdfRenderFactory<T>
) {
  if (!error) {
    throw new Error('You must call onProgress before renderPdfInWorker');
  }

  const renderPdfInWorker = async (props: T) => {
    try {
      const renderer = await RenderFactory();
      const blob = await renderer.renderPdf(props);
      return URL.createObjectURL(blob);
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  };

  function onProgress(cb: typeof console.error) {
    return (error = cb);
  }

  expose({
    renderPdfInWorker,
    onProgress,
  });
}
