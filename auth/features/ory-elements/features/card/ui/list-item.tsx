import { PropsWithChildren } from "react"
import { cn } from "../../../shared/util/cn"
import { Button } from "@/components/ui/button"

export type SVGIcon = React.FunctionComponent<
  React.ComponentProps<"svg"> & { size?: number }
>

type ListItemProps<T extends React.ElementType = "div"> = {
  icon: SVGIcon
  as?: T
  title: string
  description: string
}

export function ListItem<T extends React.ElementType = "div">({
  icon: Icon,
  as,
  title,
  description,
  children,
  className,
  ...props
}: PropsWithChildren<ListItemProps<T>> & React.ComponentPropsWithoutRef<T>) {
  const Comp = as || Button

  return (
    <Comp
      {...props}
      variant="ghost"
      className={cn(
        "flex w-full items-start gap-3 p-2 text-left justify-start h-auto",
        className as string,
      )}
    >
      <span className="mt-1">
        {Icon && (
          <Icon size={16} className="text-muted-foreground" />
        )}
      </span>
      <span className="inline-flex max-w-full min-w-1 flex-1 flex-col leading-normal">
        <span className="wrap-break-words">
          {title}
        </span>
        <span className="text-muted-foreground">
          {description}
        </span>
      </span>
      {children}
    </Comp>
  )
}
