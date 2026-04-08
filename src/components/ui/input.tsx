import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[6px] bg-white px-3 py-2 text-sm text-[#171717] shadow-[rgb(235,235,235)_0px_0px_0px_1px] placeholder:text-[#808080] focus:outline-2 focus:outline-[hsla(212,100%,48%,1)] focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
