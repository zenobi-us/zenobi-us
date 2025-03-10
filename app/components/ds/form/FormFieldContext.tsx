import * as React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
};
export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);
