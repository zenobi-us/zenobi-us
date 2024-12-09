import { FormspreeProvider, useForm } from '@formspree/react';
import { AnimatePresence } from 'framer-motion';
import type { PropsWithChildren } from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ds/drawer/Drawer';
import { Box } from '~/components/ds/box/Box';
import { Divider } from '~/components/ds/divider/Divider';

import { ContactForm } from '../forms/ContactForm';
import { Heading } from '../cmscontent/Heading';
import { GithubLink } from '../GlobalNav/GithubLink';
import { LinkedinLink } from '../GlobalNav/LinkedinLink';
import { InstagramLink } from '../GlobalNav/InstagramLink';

export function ContactFormDrawer({ children }: PropsWithChildren) {
  return (
    <Drawer shouldScaleBackground={true}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerPortal>
        <DrawerContent className="text-text-base bg-background-overlay border-0 w-auto mx-2 px-1 landscape:md:ml-auto landscape:md:w-96 landscape:md:mr-8 landscape:md:px-2">
          <DrawerHeader className="gap-4">
            <DrawerTitle>
              <Heading
                level={2}
                className="prose-lg font-semibold text-headings-primary"
              >
                Contact Me
              </Heading>
            </DrawerTitle>
            <DrawerDescription>Get in touch with me...</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <AnimatePresence mode="popLayout">
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
            </AnimatePresence>
          </DrawerBody>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
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
