import { tv } from 'tailwind-variants';

const Styles = tv({
  slots: {
    block: ['rounded fit-content relative'],
    image: ['rounded', 'max-w-full', 'object-cover', 'h-auto'],
  },
});

export function Image({
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  const styles = Styles();
  return (
    <div className={styles.block()}>
      <img
        {...props}
        className={styles.image()}
        alt={props.alt}
      />
    </div>
  );
}
