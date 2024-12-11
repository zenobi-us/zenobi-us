/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef as forwardReactRef } from 'react';

export type MergeWithAs<
  ComponentProps extends object,
  AsProps extends object,
  AdditionalProps extends object = any,
  AsComponent extends As = As
> = RightJoinProps<ComponentProps, AdditionalProps> &
  RightJoinProps<AsProps, AdditionalProps> & {
    as?: AsComponent;
  };

export type ComponentWithAs<
  Component extends As,
  Props extends object = any
> = {
  <AsComponent extends As = Component>(
    props: MergeWithAs<
      React.ComponentProps<Component>,
      React.ComponentProps<AsComponent>,
      Props,
      AsComponent
    >
  ): JSX.Element;

  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<any>;
  id?: string;
};
/**
 * Extract the props of a React element or component
 */
export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
  as?: As;
};

export type As<Props = any> = React.ElementType<Props>;

export type OmitCommonProps<
  Target,
  OmitAdditionalProps extends keyof any = never
> = Omit<
  Target,
  'transition' | 'as' | 'color' | 'translate' | OmitAdditionalProps
> & {
  htmlTranslate?: 'yes' | 'no' | undefined;
};

export type RightJoinProps<
  SourceProps extends object = any,
  OverrideProps extends object = any
> = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps;

export function forwardRef<Props extends object, Component extends As>(
  component: React.ForwardRefRenderFunction<
    any,
    React.PropsWithoutRef<
      RightJoinProps<PropsOf<Component>, Props> & {
        as?: As;
      }
    >
  >
) {
  return forwardReactRef(component) as unknown as ComponentWithAs<
    Component,
    Props
  >;
}
