/**
 * Simple sorter that sorts items by date.
 *
 * if both items are dates, then it will compare them
 * if one of the items is null, then it will be pushed to the end
 */
function createDateSorter<T>(
  getDate: (item: T) => Date | null,
  direction: 'asc' | 'desc' = 'asc',
) {
  return function (a: T, b: T) {
    const aDate = getDate(a);
    const bDate = getDate(b);

    if (aDate && bDate && direction === 'asc') {
      return aDate.getTime() - bDate.getTime();
    }

    if (aDate && bDate && direction !== 'asc') {
      return bDate.getTime() - aDate.getTime();
    }

    if (aDate && bDate === null) {
      return -1;
    }

    if (aDate === null && bDate) {
      return 1;
    }

    return 1;
  };
}

export { createDateSorter };
