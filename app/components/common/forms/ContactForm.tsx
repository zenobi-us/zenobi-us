import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, RocketIcon } from '@radix-ui/react-icons';
import type { HTMLAttributes } from 'react';

import { TextInput } from '~/components/ds/form/TextInput';
import { TextAreaInput } from '~/components/ds/form/TextAreaInput';
import { Box } from '~/components/ds/box/Box';
import { Button } from '~/components/ds/button/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessages,
} from '~/components/ds/form';
import { Loader } from '~/components/ds/loader/Loader';

const ContactFormSchema = z.object({
  email: z
    .string({
      required_error:
        'I need to be able to return your message. Please provide your email address.',
    })
    .email('Please double that check your email address is correct.'),
  message: z
    .string({
      required_error: 'Please provide a message.',
    })
    .min(10, 'Your message must be at least 10 characters long'),
});

export function ContactForm({
  status = 'idle',
  onSubmit,
  onCancelClick,
  ...props
}: {
  status: 'idle' | 'sending' | 'sent';
  onSubmit: (data: z.infer<typeof ContactFormSchema>) => void;
  onCancelClick?: () => void;
} & HTMLAttributes<HTMLFormElement>) {
  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form
      onSubmit={handleSubmit}
      {...props}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <TextInput
                  {...field}
                  {...fieldState}
                  autoComplete="email"
                  disabled={status === 'sending' || status === 'sent'}
                />
              </FormControl>
              <FormMessages>
                <FormMessages.Message {...fieldState} />
              </FormMessages>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem className="flex-grow">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <TextAreaInput
                  {...field}
                  {...fieldState}
                  className="min-w-full max-w-full flex-grow max-h-60"
                  disabled={status === 'sending' || status === 'sent'}
                />
              </FormControl>
              <FormMessages>
                <FormMessages.Message {...fieldState} />
              </FormMessages>
            </FormItem>
          )}
        />
        <Box className="flex flex-row justify-between gap-2">
          {typeof onCancelClick === 'function' && (
            <Button
              secondary
              type="button"
              onClick={onCancelClick}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
            className="ml-auto"
            afterElement={
              <>
                {status === 'idle' && (
                  <RocketIcon
                    className="text-text-secondary"
                    width={18}
                    height={18}
                  />
                )}
                {status === 'sending' && (
                  <Loader
                    label="Sending"
                    size="sm"
                  />
                )}
                {status === 'sent' && (
                  <CheckIcon
                    className="text-text-highlighted"
                    width={18}
                    height={18}
                  />
                )}
              </>
            }
          >
            {(status === 'idle' && 'Send') || ''}
            {(status === 'sending' && 'Sending') || ''}
            {(status === 'sent' && 'Sent') || ''}
          </Button>
        </Box>
      </Form>
    </form>
  );
}
