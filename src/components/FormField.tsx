import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({ label, error, id, ...inputProps }: Props) {
  const fieldId = id ?? inputProps.name;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`w-full rounded-lg border bg-card px-4 py-3 outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20 ${
          error ? "border-rise" : "border-line"
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="mt-1.5 text-sm text-rise">
          {error}
        </p>
      )}
    </div>
  );
}
