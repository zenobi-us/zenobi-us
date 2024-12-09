import { useMemo } from 'react';
import { proxy, wrap, type Endpoint, type UnproxyOrClone } from 'comlink';
import { useAsync } from 'react-use';

import type { PdfRendererWorker } from './types';

export function CreatePdfWorkerHook<TProps extends object>(WorkerClass: {
  new (): Endpoint;
}) {
  const worker = wrap<PdfRendererWorker<TProps>>(new WorkerClass());

  worker.onProgress(proxy((info) => console.log(info)));

  const usePdfWorker = (props: UnproxyOrClone<TProps>) => {
    const result = useAsync(async () => {
      return worker.renderPdfInWorker(props);
    }, []);

    const output = useMemo(() => {
      return {
        url: result.value,
        loading: result.loading,
        error: result.error,
      };
    }, [result.error, result.loading, result.value]);

    return output;
  };

  return usePdfWorker;
}
