import { useCallback, type ComponentProps } from 'react';

import { getResume } from '~/services/Content/resumes';

import { renderMdxContentToString } from '../cmscontent/CmsContent';

import { PdfButton } from './PdfButton';

export function ResumePdfButton(
  props: ComponentProps<typeof PdfButton> & {
    slug: string;
  }
) {
  const getContent = useCallback(async () => {
    const data = await getResume(props.slug);

    return renderMdxContentToString({
      content: data.mdx,
      viewMode: 'pdf',
      stylesheet: (
        <style>
          {`
            * {
              margin: 0;
              padding: 0;
            }

            span {
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              gap: 0;
            }

            section {
              flex-direction: column;
              justify-content: flex-start;
              display: flex;
              margin: 0;
              margin-bottom: 15pt;
              padding: 0;
              gap: 0;
            }

            p {
              font-size: 14px;
            }

            a {
              font-size: 14px;
            }

            h1 {
              font-size: 22px;
              padding-bottom: 0;
              margin-bottom: 8pt;
            }

            h2 {
              font-size: 18px;
              padding-bottom: 0;
              margin-bottom: 8pt;
            }
          `}
        </style>
      ),
    });
  }, [props.slug]);

  return (
    <PdfButton
      {...props}
      getContent={getContent}
    />
  );
}
