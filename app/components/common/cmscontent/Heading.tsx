import React from 'react';
import { tv } from 'tailwind-variants';

import { Icon } from '~/components/ds/icon/Icon';

const Styles = tv({
  slots: {
    block: ['group relative font-semibold'],
    link: ['no-underline'],
    icon: ['hidden', 'group-hover:flex', 'flex-row items-baseline'],
  },
  variants: {
    level: {
      1: { block: 'mt-6 text-2xl text-headings-primary' },
      2: { block: 'mt-6 text-xl text-headings-primary' },
      3: { block: 'mt-6 text-lg text-headings-secondary' },
      4: { block: 'mt-6 text-base text-headings-secondary' },
      5: { block: 'mt-6 text-sm text-headings-tertiary' },
      6: { block: 'mt-6 text-xs text-headings-tertiary' },
    },
  },
});

type HeadingProps = {
  title?: string;
  id?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

function HeadingElement({
  level,
  children,
  ...props
}: Omit<HeadingProps, 'title'>) {
  const size = level || 1;
  const Element = `h${size}`;

  return <Element {...props}>{children}</Element>;
}

export function Heading({
  level,
  children,
  title,
  id,
  ...props
}: HeadingProps) {
  const styles = Styles();
  const [isHovering, setIsHovering] = React.useState(false);
  return (
    <HeadingElement
      level={level}
      className={styles.block({ level })}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      {...props}
    >
      {children}
      {title && isHovering && (
        <a
          title={title && `link to ${title}`}
          href={`#${id}`}
          className={styles.link()}
        >
          <span
            aria-label="a chain link icon"
            role="img"
            className={styles.icon()}
          >
            <Icon
              name="Link1Icon"
              size="small"
              className="w-4 h-4"
            />
          </span>
        </a>
      )}
    </HeadingElement>
  );
}
Heading.H1 = MakeHeadingElement(1);
Heading.H2 = MakeHeadingElement(2);
Heading.H3 = MakeHeadingElement(3);
Heading.H4 = MakeHeadingElement(4);
Heading.H5 = MakeHeadingElement(5);
Heading.H6 = MakeHeadingElement(6);

function MakeHeadingElement(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const HeadingElement = (props: Omit<HeadingProps, 'level'>) => {
    return (
      <Heading
        {...props}
        level={level}
      />
    );
  };
  HeadingElement.displayName = `HeadingH${level}`;

  return HeadingElement;
}
