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
    // export const listOfYears = style({
    //   width: '100%',
    // });

    listOfYears: ['w-full'],

    // export const yearList = style({
    //   display: 'grid',
    //   gridTemplateColumns: '64px auto',
    //   gridTemplateAreas: `
    //         "year . "
    //         "posts posts"
    //     `,
    // });
    yearList: [
      'grid',
      'flex-col',
      'grid-cols-[64px,auto]',
      'grid-areas-[year .,posts posts]',
    ],

    // export const yearHeader = style({
    //   display: 'inline',
    //   textAlign: 'right',
    //   gridArea: 'year',
    //   fontFamily: Tokens.typeface.SectionHeading.fontFamily,
    // });
    yearHeader: [
      'inline',
      'flex-col',
      'text-right',
      'font-bold',
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
