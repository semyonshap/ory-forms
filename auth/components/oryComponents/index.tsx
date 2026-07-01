"use client"

import { OryClientComponents } from "@/features/ory-ui/types"
import Image from "next/image"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Input } from "../ui/input"

export const OryComponents: OryClientComponents = {
  Node: {
    Anchor: ({ node }) => {
      const label = node.options.label
      return (
        <Button
          {...node.props.renderAttributes}
          title={label}
          variant="link"
          className="cursor-pointer"
        >
          {label}
        </Button>
      )
    },
    AuthMethodButton: ({ node }) => null,
    Button: ({ node }) => {
      const { isSubmitting, label, icon: Icon } = node.options
      return (
        <Button {...node.props} variant="outline">
          {isSubmitting ? <Spinner /> : Icon && <Icon />}
          {label}
        </Button>
      )
    },
    SsoButton: ({ node }) => {
      const { isSubmitting, label, icon: Icon } = node.options

      return (
        <Button {...node.props} variant="outline">
          {Icon && <Icon size={label ? 16 : 20} />}
          {isSubmitting && <Spinner />}
          {label && node.meta.label && <span>{label}</span>}
        </Button>
      )
    },
    SubmitButton: ({ node }) => null,
    Input: ({ node }) => null,
    CodeInput: ({ node }) => {
      const { value, maxLength, ...restInputProps } = node.props
      const elements = maxLength ?? 6

      return (
        <InputOTP
          {...restInputProps}
          value={value as string}
          maxLength={elements}
        >
          <InputOTPGroup>
            {Array.from({ length: elements }, (_, index) => (
              <InputOTPSlot index={index} key={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )
    },
    Image: ({ node }) => {
      return (
        <figure>
          <Image
            {...node.props.renderAttributes}
            alt={node.meta.label?.text || ""}
          />
        </figure>
      )
    },
    Select: ({ node }) => null,
    Text: () => {
      return <Input />
    },
  },
}
