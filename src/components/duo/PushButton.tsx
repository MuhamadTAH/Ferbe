import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "green" | "blue" | "red" | "white" | "ghost";

const variantClasses: Record<Variant, string> = {
  green: "bg-[#58CC02] border-[#58A700] text-white hover:bg-[#61E002] focus-visible:ring-[#58CC02]/40",
  blue: "bg-[#1CB0F6] border-[#1899D6] text-white hover:bg-[#4FC3F9] focus-visible:ring-[#1CB0F6]/40",
  red: "bg-[#FF4B4B] border-[#EA2B2B] text-white hover:bg-[#FF6B6B] focus-visible:ring-[#FF4B4B]/40",
  white: "bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7] focus-visible:ring-[#E5E5E5]/60",
  ghost: "bg-transparent border-transparent text-[#1CB0F6] hover:bg-[#1CB0F6]/10",
};

export interface PushButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/**
 * Duolingo-style 3D push button: bold label, rounded, 4px bottom edge that
 * compresses on press.
 */
export const PushButton = React.forwardRef<HTMLButtonElement, PushButtonProps>(
  ({ variant = "green", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "select-none rounded-2xl border-b-4 font-extrabold uppercase tracking-wide transition-all duration-100",
        "active:translate-y-[2px] active:border-b-2",
        "disabled:pointer-events-none disabled:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
PushButton.displayName = "PushButton";
