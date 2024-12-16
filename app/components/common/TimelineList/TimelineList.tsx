import type { ComponentProps } from 'react';
import { createContext, useContext } from 'react';
import classname from 'classnames';
import { tv } from 'tailwind-variants';

import { LinkList, type LinkListProps } from '../../ds/linklist/LinkList';
import { GroupObjectBy } from '../../../core/groupobjectby/GroupObjectBy';

import { TimelineLinkItem } from './TimelineLinkItem';
import { TimelineSummaryItem } from './TimelineSummaryItem';

const Styles = tv({
  slots: {
    listOfYears: ['w-full'],

    yearList: [
      'grid',
      'flex-col',
      'grid-cols-1 md:grid-cols-[64px,auto]',
      'grid-areas-[year ._posts posts] md:grid-areas-[year .,posts posts]',
    ],

    yearHeader: [
      'inline',
      'flex-col',
      'p-4 text-left md:p-0 md:text-right',
      'text-xl md:text-base font-bold',
      '[grid-area: year] font-section-heading',
    ],

    postsInYearList: ['p-0', '[grid-area: posts]'],
  },
});

const TimelineItemContext = createContext<unknown>(null);

export function TimelineList<T>({
  className,
  collection,
  getGroupKey,
  getItemKey,
  sorter,
  children,
}: LinkListProps &
  Pick<
    ComponentProps<typeof GroupObjectBy<T>>,
    'collection' | 'getGroupKey' | 'sorter'
  > & {
    className?: string;
    getItemKey: (item: T) => string;
  }) {
  const styles = Styles();

  return (
    <LinkList
      className={classname('timeline-list', className, styles.listOfYears())}
    >
      <GroupObjectBy
        collection={collection}
        getGroupKey={getGroupKey}
        sorter={sorter}
      >
        {(year, items) => (
          <div
            key={year}
            className={styles.yearList()}
          >
            <h2 className={styles.yearHeader()}>{year}</h2>
            <ul className={styles.postsInYearList()}>
              {items.map((item) => (
                <TimelineItemContext.Provider
                  value={item}
                  key={getItemKey(item)}
                >
                  {children}
                </TimelineItemContext.Provider>
              ))}
            </ul>
          </div>
        )}
      </GroupObjectBy>
    </LinkList>
  );
}

TimelineList.LinkItem = TimelineLinkItem;
TimelineList.SummaryItem = TimelineSummaryItem;

export function useTimelineItem<T>(): T {
  const context = useContext(TimelineItemContext);
  if (context === null) {
    throw new Error('useTimelineItem must be used within a TimelineList');
  }
  return context as T;
}
