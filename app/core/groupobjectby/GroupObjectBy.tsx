import { Fragment, type ReactNode } from 'react';

export function GroupObjectBy<T>({
  collection = [],
  getGroupKey,
  sorter,
  children: groupRenderer,
}: {
  collection: T[];
  getGroupKey: (item: T) => string;
  sorter?: (a: T, b: T) => number;
  children: (group: string, items: T[]) => ReactNode;
}) {
  const grouped: [string, T[]][] = [];
  const sorted = collection.sort(sorter);

  for (const item of sorted) {
    const groupKey = getGroupKey(item);
    const group = grouped.find(([key]) => key === groupKey);
    if (!group) {
      grouped.push([groupKey, [item]]);
      continue;
    }

    group[1].push(item);
  }

  return grouped.map(([groupKey, items]) => {
    return <Fragment key={groupKey}>{groupRenderer(groupKey, items)}</Fragment>;
  });
}
