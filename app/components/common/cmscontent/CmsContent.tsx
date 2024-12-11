import { getMDXComponent } from 'mdx-bundler/client';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Button } from '~/components/ds/button/Button';
import { Icon } from '~/components/ds/icon/Icon';

import { PdfButton } from '../pdf/PdfButton';

import { Heading } from './Heading';
import { Link } from './Link';
import { Image } from './Image';
import { CodeBlock } from './CodeBlock';
import { Blockquote } from './Blockquote';
import { Paragraph } from './Paragraph';
import { InlineCodeBlock } from './InlineCodeBlock';
import { UnorderedList } from './UnorderedList';
import { OrderedList } from './OrderedList';
import { ListItem } from './ListItem';
import {
  BrowserOnly,
  PdfOnly,
  PrintOnly,
  ViewModeProvider,
  type WithPdfViewMode,
} from './ViewMode';
import { Notice } from './Notice';
import { RoleFlipper } from './RoleFlipper/RoleFlipper';
// import { LogoThemer } from './LogoThemer/LogoThemer';

const Styles = tv({
  base: 'text-text-base text-left flex flex-col mx-4 my-0',
});

export const BrowserCmsContent = ({
  content,
  className,
}: {
  content?: string;
  className?: string;
}) => {
  const styles = Styles();
  return (
    <div className={classnames('cms-content', styles, className)}>
      <ViewModeProvider>
        <RenderMdxContent content={content} />
      </ViewModeProvider>
    </div>
  );
};

type MdxContent = Parameters<typeof getMDXComponent>[0];
type MdxGlobals = Parameters<typeof getMDXComponent>[1];
type RenderMdxProps = {
  content?: MdxContent;
  globals?: MdxGlobals & WithPdfViewMode;
} & WithPdfViewMode;

export function RenderMdxContent({
  content,
  globals,
  viewMode,
}: RenderMdxProps) {
  const Content = content ? getMDXComponent(content, globals) : () => null;
  return (
    <ViewModeProvider viewMode={viewMode}>
      <Content
        components={{
          a: Link,
          p: Paragraph,
          ul: UnorderedList,
          ol: OrderedList,
          li: ListItem,
          h1: Heading.H1,
          h2: Heading.H2,
          h3: Heading.H3,
          h4: Heading.H4,
          h5: Heading.H5,
          h6: Heading.H6,
          img: Image,
          pre: CodeBlock,
          code: InlineCodeBlock,
          blockquote: Blockquote,
          Button,
          PdfButton,
          Widgets: {
            RoleFlipper,
            //   LogoThemer,
          },
          Icon,
          PdfOnly,
          PrintOnly,
          BrowserOnly,
          Notice,
        }}
      />
    </ViewModeProvider>
  );
}

export async function renderMdxContentToString({
  content,
  globals,
  viewMode,
  stylesheet,
}: RenderMdxProps & { stylesheet?: React.ReactNode }) {
  const { renderToString } = await import('react-dom/server');
  const output = renderToString(
    <>
      {stylesheet}
      <RenderMdxContent
        content={content}
        globals={globals}
        viewMode={viewMode}
      />
    </>
  );
  return output;
}
