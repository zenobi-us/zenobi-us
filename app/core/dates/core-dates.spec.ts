import { createDateSorter } from './core-dates';
type Item = { date: string | null };

describe('createDateSorter', () => {
  const getDate = (item: Item) => {
    if (!item.date) {
      return null;
    }
    return new Date(item.date);
  };

  it('should sort dates in descending order', () => {
    const sorter = createDateSorter(getDate, 'desc');
    const items = [
      { date: '2022-01-01' },
      { date: '2022-01-03' },
      { date: '2022-01-02' },
    ];
    const sortedItems = items.sort(sorter);
    expect(sortedItems).toEqual([
      { date: '2022-01-03' },
      { date: '2022-01-02' },
      { date: '2022-01-01' },
    ]);
  });

  it('should handle null dates', () => {
    const sorter = createDateSorter(getDate, 'asc');
    const items = [
      { date: '2022-01-01' },
      { date: null },
      { date: '2022-01-02' },
    ];

    const sortedItems = items.sort(sorter);
    expect(sortedItems).toEqual([
      { date: '2022-01-01' },
      { date: '2022-01-02' },
      { date: null },
    ]);
  });
});
