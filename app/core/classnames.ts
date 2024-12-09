import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export function classnames(...options: Parameters<typeof classNames>) {
  return twMerge(classNames(options));
}
