import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "link";
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      loadingText,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 cursor-pointer focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const variants = {
      default:
        "bg-primary text-white shadow hover:bg-primary/90 active:bg-primary/80 active:scale-[0.98]",
      destructive:
        "bg-destructive text-white shadow-sm hover:bg-destructive/90 active:bg-destructive/80 active:scale-[0.98]",
      outline:
        "border border-input bg-transparent shadow-sm hover:bg-gray-100 hover:text-accent-foreground active:bg-gray-200 active:scale-[0.98]",
      secondary:
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/70 active:scale-[0.98]",
      ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.98]",
      link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
    };

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
      link: "px-0 py-0",
    };

    // Spinner colors based on variant (spinColor, ringColor)
    const spinnerColors: Record<typeof variant, { spin: string; ring: string }> = {
      default: { spin: "#ffffff", ring: "rgba(255,255,255,0.3)" },
      destructive: { spin: "#ffffff", ring: "rgba(255,255,255,0.3)" },
      outline: { spin: "#111827", ring: "rgba(0,0,0,0.1)" },
      secondary: { spin: "#111827", ring: "rgba(0,0,0,0.1)" },
      ghost: { spin: "#111827", ring: "rgba(0,0,0,0.1)" },
      link: { spin: "#111827", ring: "rgba(0,0,0,0.1)" },
    };

    const compiledClassName = cn(baseStyles, variants[variant], sizes[size], className);

    return (
      <button
        ref={ref}
        className={compiledClassName}
        {...props}
        disabled={loading || props.disabled}
      >
        {loading ? (
          <>
            <Spinner
              spinColor={spinnerColors[variant].spin}
              ringColor={spinnerColors[variant].ring}
              size={16}
            />
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
