import { useCallback, useMemo } from 'react';
import type { TocItem } from 'remark-flexible-toc';
import TreeView, { type INode } from 'react-accessible-treeview';
import { tv } from 'tailwind-variants';

import { Box } from '~/components/ds/box/Box';

type TocLeaf = INode<{ href: string }>;

function ident(numbering: number[]) {
  return numbering.join('.');
}

/**
 * Takes a flat list of items and returns a nested list of items
 *
 */
function useToc(toc: TocItem[]) {
  const findChildren = useCallback(
    (parent: { numbering: number[] }) => {
      return toc.filter((item) => {
        return ident(item.numbering.slice(0, -1)) === ident(parent.numbering);
      });
    },
    [toc]
  );

  const unflatten = useCallback(() => {
    /**
     * React Accessible Tree wants a flat list, at the top of which is the root.
     *
     * We never show this item. It's just a placeholder to make the tree work.
     */
    const root = {
      id: '1',
      name: 'Root',
      metadata: { href: '#' },
      parent: null,
      children: [], // start off with an empty list of children
    };
    // Now compute the direct descendants of the root
    root.children = findChildren({ numbering: [1] }).map((child) => {
      return child.numbering.join('.');
    });

    // start the tree off with root
    const output: TocLeaf[] = [root];

    // for each item, look in the list to see if any of the items are a child
    // children are identified by having a numbering that both starts with the parent's numbering and
    // is longer by one digit.
    for (const item of toc) {
      const id = ident(item.numbering);

      const children = findChildren(item);

      output.push({
        id,
        name: item.value,
        metadata: { href: item.href },
        parent: ident(item.numbering.slice(0, -1)),
        children: children.map((child) => {
          return ident(child.numbering);
        }),
      });
    }

    return output;
  }, [findChildren, toc]);

  const output = useMemo(() => {
    return { items: unflatten() };
  }, [unflatten]);

  return output;
}

const Styles = tv({
  slots: {
    block: ['flex flex-col flex-grow items-end', 'text-text-muted'],
    tree: ['flex flex-col items-end flex-gro-0'],
    leaf: [
      'flex flex-col',
      'cursor-pointer',
      'hover:text-text-positive items-end',
      'px-2 py-1',
      // use custom CSS variable for indentation as px
      'mr-[var(--indent)]',
    ],
    toggle: ['cursor-pointer', 'block', 'xl:hidden'],
  },
  variants: {
    expanded: {
      true: {
        block: ['flex'],
      },
      false: {
        block: ['hidden'],
      },
    },
    selected: {
      true: ['text-text-positive'],
    },
  },
});

export function TableOfContents({
  toc,
  className,
}: {
  toc: TocItem[];
  className?: string;
}) {
  const tocData = useToc(toc);
  const styles = Styles({});

  return (
    <Box className={styles.block({ className })}>
      <TreeView
        data={tocData.items}
        expandedIds={['1']}
        nodeRenderer={({
          element,
          level,
          isSelected,
          isHalfSelected,
          getNodeProps,
        }) => {
          return (
            <span
              {...getNodeProps()}
              className={styles.leaf({
                selected: isSelected || isHalfSelected,
              })}
              style={{
                // set the indentation based on the level of the item
                // using a custom CSS variable
                //@ts-expect-error css variables are not typed
                '--indent': `${level * 5}px`,
              }}
            >
              {element.name}
            </span>
          );
        }}
      />
    </Box>
  );
}
