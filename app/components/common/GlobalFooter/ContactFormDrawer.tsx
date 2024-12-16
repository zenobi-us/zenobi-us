import { FormspreeProvider, useForm } from '@formspree/react';
import { useState, type PropsWithChildren } from 'react';
import { Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Divider } from '~/components/ds/divider/Divider';
import { SimpleDrawer } from '~/components/ds/drawer/SimpleDrawer';
import { Button } from '~/components/ds/button/Button';
import {
  DrawerBody,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ds/drawer/Drawer';

import { ContactForm } from '../forms/ContactForm';
import { LinkedinLink } from '../GlobalNav/LinkedinLink';

export function ContactFormDrawer({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<'contact' | 'social'>('social');
  return (
    <SimpleDrawer
      onClose={() => setMode('social')}
      title={mode === 'social' ? 'Get in touch' : 'Send me a message'}
      trigger={children}
    >
      <DrawerHeader className="gap-4">
        <DrawerTitle className="mx-auto">
          {mode === 'social' && <>Contact me...</>}
          {mode === 'contact' && <>Send me a message</>}
        </DrawerTitle>
        <DrawerDescription className="mx-auto">
          {mode === 'contact' && (
            <>Send me a message and I will get back to you as soon as I can,</>
          )}
        </DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <AnimatePresence>
          {mode === 'social' && (
            <motion.div className="flex flex-col flex-grow justify-center gap-2">
              <LinkedinLink className="flex gap-4 items-center hover:text-text-link-active hover:cursor-pointer mx-auto my-4">
                on LinkedIn
              </LinkedinLink>
              <Divider
                size="small"
                label="Or"
                className="w-full bg-background-card"
              />

              <Button
                rounded
                secondary
                beforeElement={<Mail size={32} />}
                onClick={() => setMode('contact')}
              >
                Send me an email
              </Button>
            </motion.div>
          )}
          {mode === 'contact' && (
            <motion.div
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FormspreeProvider>
                <FormSpreeContactForm className="flex flex-col " />
              </FormspreeProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </DrawerBody>
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
