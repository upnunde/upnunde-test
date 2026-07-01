import * as React from "react"

import {
  Input as DsInput,
  InputGroup,
  InputHypertext,
  inputVariants,
} from "design-system/ui/input"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof DsInput>
>(({ ...props }, ref) => {
  return <DsInput ref={ref} {...props} />
})

Input.displayName = "Input"

export { Input, InputGroup, InputHypertext, inputVariants }
