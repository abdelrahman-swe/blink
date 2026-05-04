import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FormSelectProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  options: { id: number | string; name: React.ReactNode | string }[];
  disabled?: boolean;
  required?: boolean;
  isLoading?: boolean;

  errorDict?: any;
  onChangeOverride?: (value: string | number) => void;
  value?: string | number;
}

export function CheckoutFormSelect({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
  required,
  isLoading,
  errorDict,
  onChangeOverride,
  value: externalValue,
}: FormSelectProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const errorId = `${name}-error`;
        const labelId = `${name}-label`;

        return (
          <div className="space-y-2">
            <Label id={labelId} className="text-[16px] font-medium gap-1!">
              {label}
              {required && (
                <span className="text-destructive" aria-hidden="true">
                 *
                </span>
              )}
            </Label>

            <Select
              disabled={disabled || isLoading}
              onValueChange={(value) => {
                const numValue = Number(value);
                const finalValue = isNaN(numValue) || value.trim() === "" ? value : numValue;
                if (name !== "_ignored_unused") {
                  field.onChange(finalValue);
                }
                if (onChangeOverride) {
                  onChangeOverride(finalValue);
                }
              }}
              value={externalValue !== undefined ? String(externalValue) : (field.value !== undefined && field.value !== null && field.value !== 0) ? String(field.value) : ""}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              aria-labelledby={labelId}
              required={required}
            >
              <SelectTrigger
                className={
                  error
                    ? "w-full border-destructive/50 focus-visible:ring-destructive/20"
                    : "w-full border-[#E6E6E6] shadow-2xs rtl:flex-row-reverse"
                }
              >
                <div className="flex items-center gap-2">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0 ml-2" />}
                  <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                    Loading...
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : options && options.length > 0 ? (
                  options.map((option) => (
                    <SelectItem key={option.id} value={String(option.id)}>
                      {option.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    No options available
                  </div>
                )}
              </SelectContent>
            </Select>

            {error && (
              <p
                id={errorId}
                role="alert"
                className="text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200"
              >
                {error.message && errorDict ? (errorDict[error.message] || error.message) : error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
