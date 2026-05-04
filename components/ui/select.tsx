"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    className?: string
    children?: React.ReactNode
    size?: "default" | "sm"
  }
>(({ className, children, size = "default", ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    data-size={size}
    className={cn(
      "border-border bg-background data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex min-h-9 w-fit items-center justify-between gap-2 rounded-md border px-0 md:px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:min-h-9 data-[size=sm]:min-h-8 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rtl:flex-row-reverse",
      className
    )}
    {...props as any}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & {
    className?: string
    children?: React.ReactNode
  }
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props as any}
  >
    <ChevronUpIcon className="size-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & {
    className?: string
    children?: React.ReactNode
  }
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props as any}
  >
    <ChevronDownIcon className="size-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    className?: string
    children?: React.ReactNode
  }
>(({ className, children, position = "popper", align = "center", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        "ms-10 md:ms-0 bg-popover cursor-pointer! px-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height)  origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      align={align}
      {...props as any}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
    className?: string
    children?: React.ReactNode
  }
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
    {...props as any}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    className?: string
    children?: React.ReactNode
  }
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "focus:bg-accent cursor-pointer! mb-1 focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pe-8 rtl:pe-2 ps-3 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 rtl:flex-row-reverse",
      className
    )}
    {...props as any}
  >
    <span className="absolute end-2 flex size-3.5 items-center justify-center rtl:start-2">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
    className?: string
    children?: React.ReactNode
  }
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
    {...props as any}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
