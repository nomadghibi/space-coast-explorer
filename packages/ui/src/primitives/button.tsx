import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${className}`}
      type={type}
      {...props}
    />
  );
}
