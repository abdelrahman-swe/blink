import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tick01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface PaymentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: "paid" | "failed";
}

export function PaymentStatusDialog({ open, onOpenChange, status }: PaymentStatusDialogProps) {
  const { checkout } = useDictionary();
  const t = checkout?.checkout?.paymentStatus;

  const config = {
    paid: {
      title: t?.paidTitle || "Payment Successful",
      message: t?.paidMessage || "Thank you for purchasing. Your payment was successful.",
      icon: Tick01Icon,
      theme: {
        outer: "bg-[#EDF8ED80]",
        middle: "bg-[#DAF1DB]",
        inner: "bg-[#DAF1DB]",
        border: "border-[#58BD5A]",
        iconColor: "#22C55E",
      },
    },
    failed: {
      title: t?.failedTitle || "Payment Failed",
      message: t?.failedMessage || "Something went wrong. We couldn’t process your payment.",
      icon: Cancel01Icon,
      theme: {
        outer: "bg-[#FFE5E580]",
        middle: "bg-[#FFCCCC]",
        inner: "bg-[#FFCCCC]",
        border: "border-[#E80000]",
        iconColor: "#E80000",
      },
    },
  };

  const currentConfig = config[status];
  const messageId = `${status}-message`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md text-center flex flex-col items-center"
      >
        <div className="flex flex-col items-center justify-center">
          <StatusIcon icon={currentConfig.icon} theme={currentConfig.theme} />

          <div className="space-y-2 mt-4">
            <DialogTitle className="text-2xl font-bold text-center">
              {currentConfig.title}
            </DialogTitle>
            <DialogDescription className="text-center max-w-xs mx-auto text-[#4D4D4D]">
              {currentConfig.message}
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface StatusIconProps {
  size?: number;
  icon: any;
  theme: {
    outer: string;
    middle: string;
    inner: string;
    border: string;
    iconColor: string;
  };
}

function StatusIcon({ size = 64, icon, theme }: StatusIconProps) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className={`absolute inset-0 rounded-full ${theme.outer}`} />
      <div className={`absolute inset-2 rounded-full ${theme.middle}`} />
      <div className={`relative z-10 flex items-center justify-center rounded-full border-2 p-1 ${theme.inner} ${theme.border}`}>
        <HugeiconsIcon icon={icon} size={20} color={theme.iconColor} strokeWidth={2} />
      </div>
    </div>
  );
}
