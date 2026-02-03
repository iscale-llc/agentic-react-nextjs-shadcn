import { Button } from "@/components/ui/button"
import { forwardRef, type ComponentProps } from "react"

type IconButtonProps = ComponentProps<typeof Button> & {
  "aria-label": string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button ref={ref} size="icon" variant="ghost" {...props}>
        {children}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"
