import { Select as SelectPrimitive } from "@base-ui/react/select"
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs"
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down.mjs"

import { cn } from "#/lib/utils.ts"

function SelectRoot<Value extends string>({
  ...props
}: SelectPrimitive.Root.Props<Value>) {
  return <SelectPrimitive.Root {...props} />
}

function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-background px-3 text-sm text-foreground shadow-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectValue(props: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value {...props} />
}

function SelectPositioner(props: SelectPrimitive.Positioner.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner sideOffset={6} {...props} />
    </SelectPrimitive.Portal>
  )
}

function SelectPopup({ className, ...props }: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Popup
      className={cn(
        "z-50 max-h-80 min-w-(--anchor-width) overflow-y-auto rounded-lg border bg-background p-1 text-foreground shadow-md outline-none",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md px-2 py-2 pl-8 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-muted",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex">
        <CheckIcon aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export {
  SelectRoot as Select,
  SelectTrigger,
  SelectValue,
  SelectPositioner,
  SelectPopup,
  SelectItem,
}
