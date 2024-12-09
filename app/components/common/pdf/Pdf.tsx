import { Page, Document, StyleSheet, Font, View } from '@react-pdf/renderer';
import type { PropsWithChildren } from 'react';
import Html from 'react-pdf-html';

import { CreatePdfRenderer } from '~/core/pdf/CreatePdfRenderer';

function stripLeadingAndTrailingSlashes(filename: string) {
  return filename.replace(/^\/|\/$/g, '');
}

function fontpath(filename: string) {
  return [`/ttf`, stripLeadingAndTrailingSlashes(filename)].join('/');
}

export type PdfProps = { html: string };

export const Pdf = ({ html }: PdfProps) => {
  Font.register({
    family: 'Roboto Slab',
    fonts: [
      {
        src: fontpath('roboto-slab/roboto-slab-latin-400-normal.ttf'),
        fontWeight: 'normal',
      },
      {
        src: fontpath('roboto-slab/roboto-slab-latin-400-normal.ttf'),
        fontStyle: 'italic',
      },
      {
        src: fontpath('roboto-slab/roboto-slab-latin-700-normal.ttf'),
        fontWeight: 'bold',
      },
    ],
  });
  Font.register({
    family: 'Roboto Mono',
    fonts: [
      { src: fontpath('roboto-mono/roboto-mono-latin-400-normal.ttf') },
      {
        src: fontpath('roboto-mono/roboto-mono-latin-700-normal.ttf'),
        fontWeight: 'bold',
      },
      {
        src: fontpath('roboto-mono/roboto-mono-latin-400-italic.ttf'),
        fontStyle: 'italic',
      },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Roboto Slab',
      padding: 15,
    },
  });

  return (
    <Document>
      <Page style={styles.page}>
        <Html
          renderers={{
            View: ({ children }: PropsWithChildren) => (
              <View wrap={false}>{children}</View>
            ),
          }}
        >
          {html}
        </Html>
      </Page>
    </Document>
  );
};

export const PdfRenderer = CreatePdfRenderer(Pdf);
