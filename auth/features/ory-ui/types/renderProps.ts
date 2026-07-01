import {
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import { omittedInputKeys } from "."
import { ComponentType, MouseEventHandler } from "react"

type OmittedImageKeys = (typeof omittedInputKeys)[number]
type OmittedAnchorKeys = (typeof omittedInputKeys)[number]

type IconOption = ComponentType<{ size?: number }>

export type FormOptionsInput = {
  label?: string
}

export type FormOptionsButton = {
  label?: string
  icon?: IconOption
  isSubmitting: boolean
}

export type FormOptionsAuthMethodButton = {
  label?: string
  icon?: IconOption
  description?: string
}

export type FormImageProps = {
  renderAttributes: Omit<UiNodeImageAttributes, OmittedImageKeys>
}

export type FormAnchorProps = {
  renderAttributes: Omit<UiNodeAnchorAttributes, OmittedAnchorKeys>
}

export type FormInputProps = {
  id: string
  name: string
  value: string | number | readonly string[] | undefined

  onClick?: MouseEventHandler
  onChange?: (event: any) => void
  onBlur: () => void
  ref?: (instance: any) => void

  disabled?: boolean
  type: UiNodeInputAttributesTypeEnum
  maxLength?: number
  autoComplete?: string
  placeholder: string
}

export type FormInputHiddenProps = {
  name: string
  value: string | number | readonly string[] | undefined
  onChange: (event: any) => void
  onBlur: () => void
  ref?: (instance: any) => void
  id?: string
  disabled?: boolean
}

export type FormInputButtonProps = {
  name: string
  value: string | number | readonly string[] | undefined
  onClick: (event: any) => void

  disabled?: boolean
}
