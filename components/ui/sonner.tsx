"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const isMobile = useIsMobile()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={isMobile ? "top-center" : "bottom-right"}
      gap={8}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600" />,
        info: <InfoIcon className="size-5 text-[#0d0d0d]" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-rose-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-[#0d0d0d]" />,
      }}
      toastOptions={{
        duration: 3500,
        classNames: {
          toast: [
            "group flex items-center gap-2 w-full",
            "bg-white dark:bg-[#1a1a1a]",
            "border border-[#E6E6E6] dark:border-[oklch(1_0_0_/_10%)]",
            "rounded-xl shadow-md px-4 py-3",
            "text-sm font-medium text-[#0d0d0d] dark:text-[oklch(0.985_0_0)]",
          ].join(" "),
          title: "text-sm font-semibold leading-snug",
          description: "text-xs text-[#999999] dark:text-[oklch(0.708_0_0)] mt-0.5",
          // Subtle left-border accent per type — keeps the minimal aesthetic
          success: "border-l-4 border-l-emerald-500",
          error: "border-l-4 border-l-rose-500",
          warning: "border-l-4 border-l-amber-400",
          info: "border-l-4 border-l-[#0d0d0d] dark:border-l-[oklch(0.985_0_0)]",
          // Action / close button
          actionButton: "bg-[#0d0d0d] text-white dark:bg-[oklch(0.985_0_0)] dark:text-[#0d0d0d] rounded-lg px-3 py-1 text-xs font-semibold",
          cancelButton: "bg-[#E6E6E6] text-[#0d0d0d] rounded-lg px-3 py-1 text-xs font-semibold",
          closeButton: "text-[#999999] hover:text-[#0d0d0d] dark:hover:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
