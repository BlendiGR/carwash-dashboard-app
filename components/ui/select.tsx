import { forwardRef, SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  startIcon?: ReactNode;
}

/**
 * Select - Native select generic component.
 * Uses native browser behavior with standard styling to match Inputs.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, startIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 pointer-events-none z-10">
            {startIcon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-xl border border-gray-200 bg-white py-2 text-sm shadow-sm transition-colors",
            "focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "appearance-none", // Remove default arrow to use custom one
            "cursor-pointer",
            startIcon ? "pl-10 pr-10" : "px-3 pr-10",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
