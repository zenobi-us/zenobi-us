import React from 'react';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';

import { Box } from '../box/Box';

const Styles = tv({
  slots: {
    list: ['tag-list', 'font-section-description, gap-4'],
    item: ['tag-list__item', 'px-2'],
  },
});

export type TagListProps = {
  className?: string;
  tags: string[];
};

export const TagList: React.FC<TagListProps> = ({ className, tags }) => {
  const styles = Styles();
  return (
    <Box className={classnames('tag-list', className, styles.list())}>
      {tags.map((tag) => (
        <span
          className={styles.item()}
          key={tag}
        >
          {tag}
        </span>
      ))}
    </Box>
  );
};
