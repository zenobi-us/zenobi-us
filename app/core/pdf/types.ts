export type OnProgressCallback = (cb: typeof console.error) => void;

export type PdfRenderer<T extends object> = {
  renderPdf: (props: T) => Promise<Blob>;
};

export type PdfToUrlRenderer<T> = (props: T) => Promise<string>;

export type PdfRenderFactory<T extends object> = () => Promise<PdfRenderer<T>>;

export type PdfRendererWorker<T extends object> = {
  renderPdfInWorker: PdfToUrlRenderer<T>;
  onProgress: OnProgressCallback;
};
