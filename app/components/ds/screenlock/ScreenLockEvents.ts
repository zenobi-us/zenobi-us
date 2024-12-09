import mitt from 'mitt';

export type ScreenLockEvents = {
  popped: { id: string };
  pushed: { id: string };
};

export const ScreenLockEvents = mitt<ScreenLockEvents>();
