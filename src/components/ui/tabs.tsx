import * as React from "react"
type Ctx = { value: string; setValue: (v: string) => void }
const TabsCtx = React.createContext<Ctx | null>(null)
export function Tabs({ defaultValue, className = "", children }: { defaultValue: string; className?: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue)
  return <TabsCtx.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsCtx.Provider>
}
export function TabsList({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`inline-flex gap-2 rounded-lg border border-neutral-800 bg-neutral-900/70 p-1 ${className}`} {...props} />
}
export function TabsTrigger({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)!
  const active = ctx.value === value
  return (
    <button
      onClick={() => ctx.setValue(value)}
      data-state={active ? "active" : "inactive"}
      className={`px-3 py-1 rounded-md text-sm border transition ${active ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-neutral-800 text-neutral-100 border-neutral-700 hover:bg-neutral-700"} ${className}`}
    >
      {children}
    </button>
  )
}
export function TabsContent({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)!
  if (ctx.value !== value) return null
  return <div className={className}>{children}</div>
}