import * as React from "react"

import { Textarea as DsTextarea } from "design-system/ui/textarea"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof DsTextarea>
>(({ ...props }, ref) => {
  return <DsTextarea ref={ref} {...props} />
})

Textarea.displayName = "Textarea"

export { Textarea }
