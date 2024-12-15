import { FormspreeProvider, useForm } from '@formspree/react';
import type { PropsWithChildren } from 'react';

import { Box } from '~/components/ds/box/Box';
import { Divider } from '~/components/ds/divider/Divider';
import { SimpleDrawer } from '~/components/ds/drawer/SimpleDrawer';

import { ContactForm } from '../forms/ContactForm';
import { GithubLink } from '../GlobalNav/GithubLink';
import { LinkedinLink } from '../GlobalNav/LinkedinLink';
import { InstagramLink } from '../GlobalNav/InstagramLink';

export function ContactFormDrawer({ children }: PropsWithChildren) {
  return (
    <SimpleDrawer
      trigger={children}
      title="Contact Me"
      description="Get in touch with me..."
      className="m-4 p-4"
    >
      <Box className="flex flex-col justify-center w-full gap-4">
        <GithubLink className="flex gap-2 hover:text-text-link-active hover:cursor-pointer">
          on Github
        </GithubLink>
        <LinkedinLink className="flex gap-2 hover:text-text-link-active hover:cursor-pointer">
          on LinkedIn
        </LinkedinLink>
        <InstagramLink className="flex gap-2 hover:text-text-link-active hover:cursor-pointer">
          on Instagram
        </InstagramLink>
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
        <FormSpreeContactForm />
      </FormspreeProvider>
    </SimpleDrawer>
  );
}

function FormSpreeContactForm() {
  const [state, handleSubmit] = useForm('myzyaypz');

  return (
    <ContactForm
      status={state.submitting ? 'sending' : 'idle'}
      onSubmit={handleSubmit}
    />
  );
}
