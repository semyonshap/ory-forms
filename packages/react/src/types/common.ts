import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { OryFlowContainer } from './container'
import { ComponentPropsWithoutRef, ComponentType, FormEventHandler, PropsWithChildren } from 'react'
import {
  FormRenderSelect,
  FormRenderInput,
  FormRenderImageProps,
  FormRenderTextProps,
  FormRenderAnchorProps,
  FormRenderLabelProps,
  FormRenderButton,
  IconProps,
  FormRenderCardProps,
  FormRenderCardDivider,
  FormRenderCheckbox,
} from './render'
import { OryClientConfiguration } from './config'

export type FormValues = Record<string, string | boolean | number | string[] | undefined>

export type FormRootProps = ComponentPropsWithoutRef<'form'> & {
  onSubmit: FormEventHandler<HTMLFormElement>
}

export type FlowInputProps = {
  flow: OryFlowContainer
  config: OryClientConfiguration
  components: Partial<OryClientComponents>
}

export type NodeSorter = (a: UiNode, b: UiNode, ctx: { flowType: string }) => number

export type GroupSorter = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number

export type OryComponents = {
  Card: {
    Default: ComponentType<FormRenderCardProps>
    Settings?: ComponentType<FormRenderCardProps>
    Divider?: ComponentType<FormRenderCardDivider>
    Form?: ComponentType<{ children?: React.ReactNode }>
  }
  Node: {
    Label: ComponentType<FormRenderLabelProps>
    AuthMethod?: ComponentType<FormRenderButton>
    Resend?: ComponentType<FormRenderButton>
    Oidc?: ComponentType<FormRenderButton>
    Button: ComponentType<FormRenderButton>
    Select?: ComponentType<FormRenderSelect>
    Checkbox: ComponentType<FormRenderCheckbox>
    Input: ComponentType<FormRenderInput>
    Code: ComponentType<FormRenderInput>
    Password?: ComponentType<FormRenderInput>
    Image: ComponentType<FormRenderImageProps>
    Text: ComponentType<FormRenderTextProps>
    Anchor: ComponentType<FormRenderAnchorProps>
  }
  Icons: {
    Providers: {
      Apple: ComponentType<IconProps>
      Auth0: ComponentType<IconProps>
      Discord: ComponentType<IconProps>
      Facebook: ComponentType<IconProps>
      Github: ComponentType<IconProps>
      Gitlab: ComponentType<IconProps>
      Google: ComponentType<IconProps>
      Linkedin: ComponentType<IconProps>
      Microsoft: ComponentType<IconProps>
      Slack: ComponentType<IconProps>
      Spotify: ComponentType<IconProps>
      X: ComponentType<IconProps>
      Yandex: ComponentType<IconProps>
    }
    System?: {
      Password?: ComponentType<IconProps>
      Code?: ComponentType<IconProps>
      CodeAsterix?: ComponentType<IconProps>
      Passkey?: ComponentType<IconProps>
      Webauthn?: ComponentType<IconProps>
      Totp?: ComponentType<IconProps>
      LookupSecret?: ComponentType<IconProps>
      HardwareToken?: ComponentType<IconProps>

      Openid?: ComponentType<IconProps>
      OfflineAccess?: ComponentType<IconProps>
      Profile?: ComponentType<IconProps>
      Email?: ComponentType<IconProps>
      Address?: ComponentType<IconProps>
      Phone?: ComponentType<IconProps>
    }
  }
  nodeSorter: NodeSorter
  groupSorter: GroupSorter
}

export type OryClientComponents = {
  Card: OryComponents['Card']
  Node: Omit<OryComponents['Node'], 'Image' | 'Password'> & {
    Image?: ComponentType<FormRenderImageProps>
  }
  Icons?: {
    Providers?: Partial<OryComponents['Icons']['Providers']>
    System?: Partial<OryComponents['Icons']['System']>
  }
} & Partial<Pick<OryComponents, 'nodeSorter' | 'groupSorter'>>
