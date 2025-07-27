import * as React from "react"
export function Alert({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border border-neutral-800 bg-neutral-900/70 p-3 ${className}`} {...props} />
}
export function AlertTitle({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-1 font-semibold text-neutral-100 ${className}`} {...props} />
}
export function AlertDescription({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`text-sm text-neutral-300 ${className}`} {...props} />
}