import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';
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

type TimelineListProps<T> = LinkListProps &
  Pick<
    ComponentProps<typeof GroupObjectBy<T>>,
    'collection' | 'getGroupKey' | 'sorter'
  > & {
    renderGroupTitle?: (props: { year: string }) => ReactNode;
    getItemKey: (item: T) => string;
  };

export function TimelineList<T>({
  className,
  collection,
  renderGroupTitle,
  getGroupKey,
  getItemKey,
  sorter,
  children,
}: TimelineListProps<T>) {
  const styles = Styles();

  const GroupTitleRenderer = useCallback(
    ({ year }: { year: string }) => {
      if (renderGroupTitle) {
        return renderGroupTitle({ year });
      }

      return <TimelineListGroupTitle year={year} />;
    },
    [renderGroupTitle]
  );

  return (
    <LinkList
      data-testid="timeline-list"
      className={classname('timeline-list', className, styles.listOfYears())}
    >
      <GroupObjectBy
        collection={collection}
        getGroupKey={getGroupKey}
        sorter={sorter}
      >
        {(year, items) => (
          <div
            data-testid={`timeline-list-year-${year}`}
            className={styles.yearList()}
            key={year}
          >
            <GroupTitleRenderer year={year} />

            <ul
              data-testid={`timeline-list-year-${year}-posts`}
              className={styles.postsInYearList()}
            >
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

export function TimelineListGroupTitle({
  year,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { year: string }) {
  const styles = Styles();
  const testid = `timeline-list-year-${year}-header`;

  return (
    <h2
      data-testid={testid}
      className={styles.yearHeader({ className })}
      {...props}
    >
      {year}
    </h2>
  );
}
