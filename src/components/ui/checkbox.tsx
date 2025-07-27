export function Checkbox({ checked = false, onCheckedChange }: { checked?: boolean; onCheckedChange?: (c: boolean) => void }) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border border-neutral-700 bg-neutral-900 text-emerald-600"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  )
}