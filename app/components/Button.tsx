import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    children: ReactNode;
}

export function Button({isLoading = false, loadingText = "Loading...", disabled, children, className = "", type = "button", ...props}: ButtonProps) {
    return (
        <button
            type={type}
            className={`rounded-md text-sm bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? loadingText : children}
        </button>
    );
}