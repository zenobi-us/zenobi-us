import React from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { Box } from '../box/Box';

const Styles = tv({
  base: ['transition-color cursor-pointer'],
});

export type PostSummaryProps = {
  title: string;
  summary?: string;
  date?: string;
  tags?: string[];
  slug?: string;
  className?: string;
  link?: React.ElementType;
};

export const PostSummary = ({
  title,
  summary,
  tags,
  date,
  slug,
  className,
  link,
}: PostSummaryProps) => {
  const Link = link || 'a';
  const styles = Styles();
  // const format = (format: string):string => Sugar.Date(date).format(format).raw

  return (
    <div className={classnames('post-summary', className, styles)}>
      <header className="post-summary__header">
        <h2 className="post-summary__title">
          <Link href={`/b/${slug}`}>{title}</Link>
        </h2>
        {date && <div className="post-summary__date">{date}</div>}
      </header>
      {summary && <div className="post-summary__sumary">{summary}</div>}
      {tags && tags.length > 0 && (
        <div className="post-summary__tags">
          {tags.map((tag: string) => (
            <Box
              key={tag}
              className="post-summary__tag"
            >
              {tag}
            </Box>
          ))}
        </div>
      )}
    </div>
  );
};
