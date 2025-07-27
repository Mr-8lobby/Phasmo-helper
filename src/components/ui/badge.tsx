import * as React from "react"
type Props = React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "outline" | "secondary" }
export function Badge({ className = "", variant = "default", ...props }: Props) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs border"
  const styles = variant === "outline"
    ? "border-neutral-700 text-neutral-200 bg-neutral-900"
    : variant === "secondary"
      ? "border-neutral-700 bg-neutral-800 text-neutral-200"
      : "border-emerald-500 bg-emerald-600 text-white"
  return <span className={`${base} ${styles} ${className}`} {...props} />
}