// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryFormSectionProps,
} from "@/features/ory-elements"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const DefaultFormSection = ({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nodes: _nodes,
  ...rest
}: OryFormSectionProps) => {
  return (
    <form
      className="flex w-full max-w-(--breakpoint-sm) flex-col px-4 md:max-w-[712px] lg:max-w-[802px] xl:max-w-4xl"
      {...rest}
    >
      {children}
    </form>
  )
}

const DefaultFormSectionContent = ({
  title,
  description,
  children,
}: OryFormSectionContentProps) => {
  return (
    <Card className="border-b-0 rounded-b-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {children}
      </CardContent>
    </Card>
  )
}

const DefaultFormSectionFooter = ({
  children,
  text,
}: OryFormSectionFooterProps) => {
  return (
    <CardFooter className="flex min-h-[72px] items-center justify-between gap-2 rounded-b-lg border-t bg-muted px-6 py-4 text-muted-foreground">
      <span>{text}</span>
      {children}
    </CardFooter>
  )
}

export {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
}
