import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-[6px] bg-white px-3 py-2 text-sm text-[#171717] shadow-[rgb(235,235,235)_0px_0px_0px_1px] placeholder:text-[#808080] focus:outline-2 focus:outline-[hsla(212,100%,48%,1)] focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
