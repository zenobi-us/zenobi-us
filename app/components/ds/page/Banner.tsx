import { tv } from 'tailwind-variants';

const Styles = tv({
  slots: {
    block: ['flex flex-col gap-4', 'bg-[image(var(--banner-image-url))]'],
    credit: [
      'font-paragraph text-text-muted text-8 text-right p-8 absolute bottom-0 right-0',
      'opacity-30',
      'after:content-[var(--banner-credit)]',
    ],
  },
});
export function Banner({ src, credit }: { src: string; credit?: string }) {
  const styles = Styles();

  return (
    <div
      className={styles.block(`banner`)}
      style={{
        // @ts-expect-error CSS variable
        '--banner-image-url': `url(${src})`,
        '--banner-credit': `"credit: ${credit}"`,
      }}
    >
      {credit && <div className={styles.credit('banner__credit')} />}
    </div>
  );
}
