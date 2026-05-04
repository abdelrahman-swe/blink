import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  errorDict?: any;
}

export function CheckoutFormInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required,
  errorDict,
}: FormInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const errorId = `${name}-error`;
        return (
          <div className="space-y-2">
            <Label htmlFor={name} className="text-[16px] font-medium gap-1!">
              {label}
              {required && (
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              )}
            </Label>
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              value={field.value || ""}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              required={required}
              className={`rtl:text-right! rtl:placeholder:text-right! ${
                error
                  ? "border-destructive/50 focus-visible:ring-destructive/20"
                  : "border-[#E6E6E6] shadow-2xs"
              }`}
            />
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
