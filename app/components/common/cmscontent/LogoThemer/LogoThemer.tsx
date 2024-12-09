import { useCallback, useState } from 'react';

import {
  Logo,
  LogoPropSchema,
  type LogoProps,
} from '~/components/common/favicons/Logo';
import { useClientSideFaviconColourStorage } from '~/components/common/favicons/useClientSideFaviconColourStorage';
import { Form } from '~/components/ds/form/Form';
import { Box } from '~/components/ds/box/Box';
import { Button } from '~/components/ds/button/Button';
import { Loader } from '~/components/ds/loader/Loader';

import { CodeExamplePopover } from './CodeExamplePopover';
import { ShareUrlButton } from './ShareUrlButton';
import { useLogoThemerForm } from './useLogoThemerForm';
import { LogoFormField } from './LogoFormField';
import { encode, useHashFormState } from './useHashFormState';
import { ButtonWithFeedback } from './ButtonWithFeedback';

export function LogoThemer() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved'>(
    'loading'
  );
  const hashState = useHashFormState('theme', LogoPropSchema);
  const storage = useClientSideFaviconColourStorage();

  // useEffect(
  //   function UpdateHash() {
  //     setStatus('idle');
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [themerForm.form, hashState, values]
  // );

  // useEffect(
  //   function StoreColoursInLocalStorage() {
  //     storage.set(values);
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [themerForm.form]
  // );

  return (
    <Box
      className="flex flex-col md:flex-row bg-background-card rounded-lg overflow-hidden items-stretch gap-8"
      style={{
        minWidth: '100%',
        minHeight: 480,
      }}
    >
      {status === 'loading' && (
        <Box className="flex flex-grow items-center justify-center">
          <Loader
            size="lg"
            effect="blurred"
            label="Loading"
          />
        </Box>
      )}
      {status !== 'loading' && (
        <LogoThemerForm
          status={status}
          initial={hashState.value || storage.value}
          onStatusChange={setStatus}
          onSaveClick={(values) => {
            storage.set(values);
            hashState.set(values);
          }}
        />
      )}
    </Box>
  );
}

function pause(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function LogoThemerForm({
  initial,
  status,
  onStatusChange,
  onSaveClick,
}: {
  initial?: Partial<LogoProps> | null;
  status: 'idle' | 'loading' | 'saving' | 'saved';
  onStatusChange: (status: 'idle' | 'loading' | 'saving' | 'saved') => void;
  onSaveClick: (values: LogoProps) => void;
}) {
  const themerForm = useLogoThemerForm({
    initial,
  });

  const values = themerForm.form.getValues();

  const handleSaveForm = useCallback(async () => {
    onStatusChange('saving');
    onSaveClick(values);

    await pause(200);
    onStatusChange('saved');

    await pause(200);
    onStatusChange('idle');
  }, [onSaveClick, onStatusChange, values]);

  return (
    <Form {...themerForm.form}>
      <Box className="relative flex flex-col flex-grow bg-background-button-secondary order-none sm:order-1">
        <Box className="flex justify-end flex-grow p-8 absolute z-10 top-0 right-0 gap-8 text-button-secondary">
          <CodeExamplePopover values={values} />
        </Box>
        <Box className="flex flex-grow justify-center items-center">
          <Logo
            width={196}
            height={196}
            {...values}
          />
        </Box>
        <Box className="flex justify-end p-8">
          <ShareUrlButton hash={encode(values)} />
        </Box>
      </Box>
      <Box className="flex justiy-center items-center p-8">
        <Box className="flex md:flex-col flex-wrap justify-center gap-2">
          <LogoFormField
            form={themerForm.form}
            name="arrowStroke"
            label="Arrow Stroke"
          />
          <LogoFormField
            form={themerForm.form}
            name="fgStroke"
            label="Foreground Stroke"
          />
          <LogoFormField
            form={themerForm.form}
            name="fgFill"
            label="Foreground Fill"
          />
          <LogoFormField
            form={themerForm.form}
            name="bgStroke"
            label="Background Stroke"
          />
          <LogoFormField
            form={themerForm.form}
            name="bgFill"
            label="Background Fill"
          />
          <LogoFormField
            form={themerForm.form}
            name="baseStroke"
            label="Base Stroke"
          />
        </Box>
        <Box className="flex flex-col gap-8">
          <Button
            className="flex-grow"
            onClick={themerForm.reset}
            title="Reset the logo to its default colours."
          >
            Reset
          </Button>
          <ButtonWithFeedback
            className="flex-grow"
            onClick={handleSaveForm}
            feedback={status === 'idle' ? null : status}
            title="Save this icon as your custom logo."
          >
            Save
          </ButtonWithFeedback>
        </Box>
      </Box>
    </Form>
  );
}
