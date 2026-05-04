import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethod } from "@/utils/types/checkout";

interface CheckoutPaymentOptionProps {
  value: PaymentMethod;
  label: string;
  disabled?: boolean;
}

export function CheckoutPaymentOption({ value, label, disabled }: CheckoutPaymentOptionProps) {
  return (
    <div
      className={`flex rtl:flex-row-reverse gap-2 py-1.5 px-2 items-center rounded-lg transition-colors
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}
    >
      <RadioGroupItem
        id={`payment-${value}`}
        className={disabled ? "pointer-events-none" : ""} 
        value={value}
        aria-labelledby={`${value}-label`}
        disabled={disabled}
      />
      <Label
        htmlFor={`payment-${value}`}
        id={`${value}-label`}
        className={`flex items-center gap-3 text-lg font-medium ${disabled ? "pointer-events-none" : "cursor-pointer"}`}
      >
        {label}
      </Label>
    </div>
  );
}
