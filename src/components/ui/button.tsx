import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-200/50 active:scale-[0.98]":
              variant === "default",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98]":
              variant === "secondary",
            "border-2 border-gray-200 bg-white hover:border-pink-200 hover:text-pink-600 hover:bg-pink-50/50 active:scale-[0.98]":
              variant === "outline",
            "hover:bg-gray-100 text-gray-600 hover:text-gray-900 active:scale-[0.98]":
              variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]":
              variant === "destructive",
          },
          {
            "h-10 px-5 py-2": size === "default",
            "h-9 rounded-lg px-4 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
