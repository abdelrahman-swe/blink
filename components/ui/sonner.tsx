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

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      icons={{
        success: <CircleCheckIcon className="size-6 text-green-600" />,
        info: <InfoIcon className="size-6 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-6 text-yellow-600" />,
        error: <OctagonXIcon className="size-6 text-red-600" />,
        loading: <Loader2Icon className="size-6 animate-spin" />,
      }}
      style={
        {
          "--success-bg": "#dcfce7",
          "--success-text": "#166534",
          "--success-border": "#86efac",

          "--error-bg": "#fee2e2",
          "--error-text": "#7f1d1d",
          "--error-border": "#fca5a5",

          "--warning-bg": "#fef3c7",
          "--warning-text": "#78350f",
          "--warning-border": "#fcd34d",

          "--info-bg": "#dbeafe",
          "--info-text": "#1e40af",
          "--info-border": "#bfdbfe",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "border rounded-xl text-base font-medium shadow-lg",
          title: "text-md font-semibold mx-3",
          success: "bg-[var(--success-bg)] text-[var(--success-text)]",
          error: "bg-[var(--error-bg)] text-[var(--error-text)]",
          warning: "bg-[var(--warning-bg)] text-[var(--warning-text)]",
          info: "bg-[var(--info-bg)] text-[var(--info-text)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
