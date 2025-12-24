import * as React from "react";
import { Label } from "@/components/ui/label";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, className, children, ...props }, ref) => {
    const id = React.useId();

    const childrenWithId = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<any>, { id })
      : children;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && <Label htmlFor={id}>{label}</Label>}
        {childrenWithId}
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
