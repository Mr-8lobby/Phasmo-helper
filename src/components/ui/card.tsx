import * as React from "react"
type DivProps = React.HTMLAttributes<HTMLDivElement>
export function Card({ className = "", ...props }: DivProps) {
  return <div className={`rounded-xl border border-neutral-800 bg-neutral-900/70 text-neutral-100 ${className}`} {...props} />
}
export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={`p-4 ${className}`} {...props} />
}