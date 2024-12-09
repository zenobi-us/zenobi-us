export const byYearSorter = <T>(a: [string, T[]], b: [string, T[]]) => {
  const aYear = parseInt(a[0]);
  const bYear = parseInt(b[0]);
  if (aYear > bYear) {
    return -1;
  }
  if (aYear < bYear) {
    return 1;
  }
  return 0;
};
