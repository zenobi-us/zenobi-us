import { FormspreeProvider, useForm } from '@formspree/react';
import { type ComponentProps, type PropsWithChildren } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Divider } from '~/components/ds/divider/Divider';
import {
  SimpleDrawer,
  useSimpleDrawer,
} from '~/components/ds/drawer/SimpleDrawer';
import {
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ds/drawer/Drawer';

import { ContactForm } from '../forms/ContactForm';
import { LinkedinLink } from '../GlobalNav/LinkedinLink';

export function ContactFormDrawer({
  children,
  anchor = 'bottomright',
  tone = 'primary',
  rounded,
}: PropsWithChildren<Omit<ComponentProps<typeof SimpleDrawer>, 'trigger'>>) {
  return (
    <SimpleDrawer
      anchor={anchor}
      tone={tone}
      rounded={rounded}
      trigger={children}
    >
      <DrawerHeader className="gap-4">
        <DrawerTitle className="mx-auto">Send me a message</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <AnimatePresence>
          <LinkedinLink className="flex gap-4 items-center hover:text-text-link-active hover:cursor-pointer mx-auto my-2">
            on LinkedIn
          </LinkedinLink>
          <Divider
            size="small"
            label="Or"
            className="w-full bg-background-card"
          />

          <FormspreeProvider>
            <FormSpreeContactForm className="flex flex-col" />
          </FormspreeProvider>
        </AnimatePresence>
      </DrawerBody>
    </SimpleDrawer>
  );
}

function FormSpreeContactForm({ className }: { className?: string }) {
  const [state, handleSubmit] = useForm('myzyaypz');
  const simpleDrawer = useSimpleDrawer();

  return (
    <ContactForm
      className={className}
      status={state.submitting ? 'sending' : 'idle'}
      onSubmit={handleSubmit}
      onCancelClick={simpleDrawer.setOpen.bind(null, false)}
    />
  );
}
