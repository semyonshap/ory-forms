import { messageTestId } from "../../../shared/util"
import { useComponents } from "../../../context"
import { useOryFlow } from "../../flows"
import { useCardHeaderText } from "../util/constructCardHeader"
import { DefaultCurrentIdentifierButton } from "./current-identifier-button"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function InnerCardHeader({
  title,
  text,
  messageId,
}: {
  title: string
  text?: string
  messageId?: string
}) {
  const { Card } = useComponents()
  return (
    <CardHeader className="flex flex-col gap-8 antialiased px-0">
      <Card.Logo />
      <div className="flex flex-col gap-2">
        <CardTitle className="text-lg leading-normal">
          {title}
        </CardTitle>
        <CardDescription
          {...(messageId ? messageTestId({ id: messageId }) : {})}
        >
          {text}
        </CardDescription>
        <DefaultCurrentIdentifierButton />
      </div>
    </CardHeader>
  )
}

/**
 * Renders the default card header component.
 *
 * This component is used to display the header of a card, including the logo, title, description, and current identifier button.
 *
 * @returns the default card header component
 * @group Components
 * @category Default Components
 */
export function DefaultCardHeader() {
  const context = useOryFlow()
  const { title, description, messageId } = useCardHeaderText(
    context.flow.ui,
    context,
  )

  return (
    <InnerCardHeader title={title} text={description} messageId={messageId} />
  )
}
