import * as React from "react"
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-md border border-neutral-700 bg-neutral-900 text-neutral-100 placeholder-neutral-500 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600 ${className}`}
      {...props}
    />
  )
)
Input.displayName = "Input"