import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "../ui/button";

interface QuantityInputProps {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  isLoading?: boolean;
  stock?: number;
  showError?: boolean;
  disabled?: boolean;
  className?: string;
}

export function QuantityInput({
  min = 1,
  max,
  value: controlledValue,
  defaultValue = 1,
  onChange,
  isLoading = false,
  stock,
  disabled = false,
  className,
}: QuantityInputProps) {
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : defaultValue;
  const effectiveMax = stock ?? max ?? 99;
  const hasReachedStock = stock !== undefined && currentValue >= stock;

  const [localValue, setLocalValue] = React.useState(currentValue);

  React.useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  const updateValue = (next: number) => {
    const clamped = Math.min(Math.max(next, min), effectiveMax);
    onChange?.(clamped);
  };

  const handleDecrease = () => updateValue(currentValue - 1);
  const handleIncrease = () => updateValue(currentValue + 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (Number.isNaN(num)) {
      setLocalValue(min);
      return;
    }
    const clampedValue = Math.min(Math.max(num, min), effectiveMax);
    setLocalValue(clampedValue);
  };

  const handleInputBlur = () => {
    updateValue(localValue);
  };
// test
  const isInteractive = !isLoading && !disabled;

  return (
    <div
      role="group"
      aria-label="Quantity selector"
      className={`flex items-center gap-4 rounded-full bg-[#E6E6E6] px-1 py-1 ${disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
    >
      {/* Minus Button */}
      <Button
        variant="ghost"
        type="button"
        aria-label="Decrease quantity"
        onClick={handleDecrease}
        disabled={!isInteractive || currentValue <= min}
        className="
    flex h-9 w-9 items-center justify-center rounded-full
    bg-white text-black
    transition
    hover:bg-gray-100
    disabled:cursor-not-allowed disabled:opacity-40
    p-0
  "
      >
        <MinusIcon className="h-3 w-3" aria-hidden="true" />
      </Button>
      {/* Input Value */}
      <div className="w-8 flex items-center justify-center">
        {isLoading ? (
          <Spinner className="h-5 w-5" aria-label="Loading quantity" />
        ) : (
          <input
            type="number"
            min={min}
            max={effectiveMax}
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            disabled={!isInteractive}
            aria-label="Quantity input"
            aria-valuemin={min}
            aria-valuemax={effectiveMax}
            aria-valuenow={currentValue}
            className="
              w-5 bg-transparent p-0 text-center text-lg font-semibold
              focus:outline-none
              disabled:cursor-not-allowed
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
        )}
      </div>

      {/* Plus Button */}
      <Button
        variant="ghost"
        type="button"
        aria-label="Increase quantity"
        onClick={handleIncrease}
        disabled={!isInteractive || currentValue >= effectiveMax || hasReachedStock}
        className="
          flex h-9 w-9 items-center justify-center rounded-full
          bg-white text-black
          transition
          hover:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-40
          p-0
        "
      >
        <PlusIcon className="h-3 w-3" aria-hidden="true" />
      </Button>
    </div>
  );
}
