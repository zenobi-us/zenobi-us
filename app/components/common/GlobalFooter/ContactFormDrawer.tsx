import { FormspreeProvider, useForm } from '@formspree/react';
import type { PropsWithChildren } from 'react';

import { Box } from '~/components/ds/box/Box';
import { Divider } from '~/components/ds/divider/Divider';
import { SimpleDrawer } from '~/components/ds/drawer/SimpleDrawer';

import { ContactForm } from '../forms/ContactForm';
import { LinkedinLink } from '../GlobalNav/LinkedinLink';

export function ContactFormDrawer({
  children,
  open,
}: PropsWithChildren<{ open: boolean }>) {
  return (
    <SimpleDrawer
      open={open}
      trigger={children}
      title="Contact Me"
      description="Get in touch with me..."
      className="w-full p-4"
    >
      <Box className="flex flex-col justify-center w-full gap-4">
        <LinkedinLink className="flex gap-2 hover:text-text-link-active hover:cursor-pointer">
          on LinkedIn
        </LinkedinLink>
        <Divider
          size="small"
          label="Or"
          className="bg-background-card"
        />

        <Box>
          Send me a message and I will get back to you as soon as I can.
        </Box>
      </Box>
      <FormspreeProvider>
        <FormSpreeContactForm className="flex flex-col flex-grow min-h-full" />
      </FormspreeProvider>
    </SimpleDrawer>
  );
}

function FormSpreeContactForm({ className }: { className?: string }) {
  const [state, handleSubmit] = useForm('myzyaypz');

  return (
    <ContactForm
      className={className}
      status={state.submitting ? 'sending' : 'idle'}
      onSubmit={handleSubmit}
    />
  );
}
