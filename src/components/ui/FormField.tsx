import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

interface InputFieldProps extends FieldProps, InputHTMLAttributes<HTMLInputElement> {}
interface SelectFieldProps extends FieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

const inputClass = (error?: string) =>
  cn(
    "w-full px-4 py-2.5 rounded-xl border text-sm text-navy placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors",
    error ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white hover:border-gray-300"
  );

export function InputField({ label, error, required, className, ...props }: InputFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-navy">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input className={inputClass(error)} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function SelectField({ label, error, required, className, children, ...props }: SelectFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-navy">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select className={cn(inputClass(error), "bg-white")} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
