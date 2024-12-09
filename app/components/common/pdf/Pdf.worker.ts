import { createPdfWorker } from '~/core/pdf/CreatePdfWorker';

export default createPdfWorker(async () => {
  const mod = await import('./Pdf');
  return mod.PdfRenderer;
});
