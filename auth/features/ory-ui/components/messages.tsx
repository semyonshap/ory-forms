import { UiText } from "@ory/client-fetch"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MessageProps {
  message: UiText
}

export const Message = ({ message }: MessageProps) => {
  const variant = message.type === "error" ? "destructive" : "default"

  return (
    <Alert variant={variant} data-testid={`ui/message/${message.id}`}>
      <AlertDescription>{message.text}</AlertDescription>
    </Alert>
  )
}

interface MessagesProps {
  messages?: Array<UiText>
}

export const Messages = ({ messages }: MessagesProps) => {
  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}
