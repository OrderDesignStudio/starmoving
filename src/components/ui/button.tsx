import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[hsla(212,100%,48%,1)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[#171717] text-white hover:bg-[#333333]": variant === "default",
            "bg-white text-[#171717] shadow-[rgb(235,235,235)_0px_0px_0px_1px] hover:bg-[#fafafa]": variant === "outline",
            "text-[#666666] hover:bg-[#fafafa] hover:text-[#171717]": variant === "ghost",
            "bg-[#ff5b4f] text-white hover:bg-[#e54d42]": variant === "destructive",
          },
          {
            "h-10 px-4 py-2 text-sm": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-12 px-6 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
