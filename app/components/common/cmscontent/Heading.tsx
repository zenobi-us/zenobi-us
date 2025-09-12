import React, { useMemo, useRef } from 'react';
import { tv } from 'tailwind-variants';
import { kebabCase } from 'lodash-es';

import { Icon } from '~/components/ds/icon/Icon';

const Styles = tv({
  slots: {
    block: ['group relative font-semibold'],
    link: ['no-underline flex items-center gap-2'],
    icon: [
      'opacity-0 transition-opacity',
      'group-hover:flex',
      'flex-row items-baseline',
    ],
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
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const childrenIsString = typeof children === 'string';

  const titleText = useMemo(() => {
    if (typeof title === 'string') {
      return title;
    }
    if (childrenIsString) {
      return children;
    }
    return;
  }, [children, title, childrenIsString]);

  return (
    <HeadingElement
      level={level}
      data-testid={`heading-element-${kebabCase(titleText)}`}
      className={styles.block({ level })}
      onMouseOver={() => iconRef.current.classList.remove('opacity-0')}
      onMouseOut={() => iconRef.current.classList.add('opacity-0')}
      {...props}
    >
      {!childrenIsString && children}
      {childrenIsString && (
        <a
          title={children && `link to ${children}`}
          href={`#${id}`}
          className={styles.link()}
        >
          {children}
          <span
            aria-label="a chain link icon"
            role="img"
            className={styles.icon()}
            ref={iconRef}
          >
            <Icon
              name="HashIcon"
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
