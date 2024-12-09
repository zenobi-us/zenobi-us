import { tv } from 'tailwind-variants';

const Styles = tv({
  // export const block = style({
  //   color: Tokens.palette.text.muted,

  //   ...Tokens.typeface.Splash,
  //   fontSize: 72,

  //   width: '100%',
  //   justifyContent: 'center',
  // });
  slots: {
    block: [
      'text-muted',
      'font-splash',
      'text-7xl',
      'w-full',
      'flex',
      'justify-center',
    ],
  },
});

export function PostEnd() {
  const styles = Styles();
  return <div className={styles.block()}>~</div>;
}
