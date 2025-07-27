import * as React from "react"
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" }
export function Button({ className = "", variant = "default", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border transition"
  const style = variant === "secondary"
    ? "bg-neutral-800 text-neutral-100 border-neutral-700 hover:bg-neutral-700"
    : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
  return <button className={`${base} ${style} ${className}`} {...props} />
}