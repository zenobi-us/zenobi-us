import { CreatePdfWorkerHook } from '~/core/pdf/CreatePdfWorkerHook';

import PdfWorker from './Pdf.worker?worker';
import { PdfProps } from './Pdf';

export const useRenderPdf = CreatePdfWorkerHook<PdfProps>(PdfWorker);
