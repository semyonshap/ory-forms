import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { ComponentPropsWithoutRef, ComponentType, FormEventHandler } from 'react'

import { OryFlowContainer } from './container'
import {
  RenderInput,
  BlockImage,
  BlockText,
  BlockAnchor,
  BlockLabel,
  BlockButton,
  IconProps,
  BlockCard,
  BlockDivider,
  BlockCheckbox,
  BlockForm,
  BlockDiv,
} from './blocks'
import { OryClientConfiguration } from './config'

export type FormValues = Record<string, string | boolean | number | string[] | undefined>

export type FormRootProps = ComponentPropsWithoutRef<'form'> & {
  onSubmit: FormEventHandler<HTMLFormElement>
}

export interface FlowInputProps {
  flow: OryFlowContainer
  config: OryClientConfiguration
  components?: Partial<OryClientComponents>
}

export type NodeSorter = (a: UiNode, b: UiNode, ctx: { flowType: string }) => number

export type GroupSorter = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number

export interface OryComponents {
  Card: {
    Card: ComponentType<BlockCard>
    Divider?: ComponentType<BlockDivider>
    Form?: ComponentType<BlockForm>
    Div?: ComponentType<BlockDiv>
  }
  Node: {
    Label: ComponentType<BlockLabel>
    AuthMethod?: ComponentType<BlockButton>
    Resend?: ComponentType<BlockButton>
    Oidc?: ComponentType<BlockButton>
    Button: ComponentType<BlockButton>
    Checkbox: ComponentType<BlockCheckbox>
    Input: ComponentType<RenderInput>
    Code?: ComponentType<RenderInput>
    Password?: ComponentType<RenderInput>
    Image: ComponentType<BlockImage>
    Text: ComponentType<BlockText>
    Anchor: ComponentType<BlockAnchor>
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
    Image?: ComponentType<BlockImage>
  }
  Icons?: {
    Providers?: Partial<OryComponents['Icons']['Providers']>
    System?: Partial<OryComponents['Icons']['System']>
  }
} & Partial<Pick<OryComponents, 'nodeSorter' | 'groupSorter'>>
