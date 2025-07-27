export function Switch({ checked = false, onCheckedChange }: { checked?: boolean; onCheckedChange?: (c: boolean) => void }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} />
      <span className="w-10 h-5 rounded-full border border-neutral-700 bg-neutral-800 peer-checked:bg-emerald-600 relative transition">
        <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-neutral-200 peer-checked:translate-x-5 transition" />
      </span>
    </label>
  )
}