"use client"

import * as React from "react"

import {
  Input as DsInput,
  InputGroup,
  InputHypertext as DsInputHypertext,
  inputVariants,
} from "design-system/ui/input"
import { cn } from "design-system/utils"

type DsInputProps = React.ComponentProps<typeof DsInput>

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return
  if (typeof ref === "function") {
    ref(value)
    return
  }
  ref.current = value
}

/**
 * DS Input은 내부 inputRef로 지우기 버튼을 동작시킨다.
 * `ref`를 그대로 넘기면 그 내부 ref가 덮여 지우기가 동작하지 않는다.
 * 레이아웃용 forwarded ref는 실제 input 노드에만 연결한다.
 */
const Input = React.forwardRef<HTMLInputElement, DsInputProps>(
  ({ ...props }, forwardedRef) => {
    const rootRef = React.useRef<HTMLDivElement>(null)

    React.useLayoutEffect(() => {
      const input = rootRef.current?.querySelector<HTMLInputElement>(
        "[data-slot=input]",
      )
      assignRef(forwardedRef, input ?? null)
      return () => assignRef(forwardedRef, null)
    })

    return (
      <div ref={rootRef} className="contents">
        <DsInput {...props} />
      </div>
    )
  },
)

Input.displayName = "Input"

type InputHypertextProps = React.ComponentProps<typeof DsInputHypertext>

/** 글자 수가 최대에 도달하면 카운터를 최대 길이(error) 상태로 표시 */
function InputHypertext({
  count,
  max,
  variant,
  className,
  ...props
}: InputHypertextProps) {
  const atMax = max != null && (count ?? 0) >= max
  const resolvedVariant = variant ?? (atMax ? "error" : "default")
  const showMaxLengthState = resolvedVariant === "error" || atMax

  return (
    <DsInputHypertext
      count={count}
      max={max}
      variant={resolvedVariant}
      className={cn(
        showMaxLengthState && "text-destructive [&>span:last-child]:text-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Input, InputGroup, InputHypertext, inputVariants }