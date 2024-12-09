import { forwardRef } from 'react';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { IconJarLogoIcon } from '@radix-ui/react-icons';
import { tv, type VariantProps } from 'tailwind-variants';
import classNames from 'classnames';

import { useFormField } from './useFormField';
const Styles = tv({
  base: ['text-text-input-label'],
  variants: {
    invalid: {
      true: [
        'text-text-critical',
        'bg-background-critical',
        'p-2',
        'rounded-md',
      ],
    },
    isTouched: {
      true: '',
    },
    isDirty: {
      true: '',
    },
    isValidating: {
      true: '',
    },
  },
});

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof Styles>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={classNames(
        'relative inline-flex items-start p-2 gap-2 pl-8 font-mono text-sm',
        Styles({
          invalid: !!props.invalid,
          isTouched: !!props.isTouched,
          isDirty: !!props.isDirty,
          isValidating: !!props.isValidating,
        }),
        className
      )}
      {...props}
    >
      {props.invalid && (
        <IconJarLogoIcon
          className="absolute top-[10px] left-2"
          height={18}
          width={18}
        />
      )}
      {body}
    </p>
  );
});

FormMessage.displayName = 'FormMessage';

const FormMessagesStyles = tv({
  base: ['flex'],
  variants: {
    align: {
      start: ['justify-start'],
      center: ['justify-center'],
      end: ['justify-end'],
    },
    stacked: {
      true: ['flex-col gap-2'],
    },
  },
  defaultVariants: {
    align: 'end',
  },
});

function FormMessages({
  children,
  ...props
}: PropsWithChildren<VariantProps<typeof FormMessagesStyles>>) {
  return <div className={FormMessagesStyles(props)}>{children}</div>;
}

FormMessages.displayName = 'FormMessages';

FormMessages.Message = FormMessage;

export { FormMessages, FormMessage };
