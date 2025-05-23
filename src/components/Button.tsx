import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "warning";
}

const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {
  let variantClass = "";
  switch (variant) {
    case "primary":
      variantClass = "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:border-gray-400";
      break;
    case "warning":
      variantClass = "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600";
      break;
    case "secondary":
    default:
      variantClass = "bg-gray-800 text-white border border-gray-700 hover:bg-gray-900 hover:border-gray-800";
      break;
  }

  return (
    <button {...props} className={`cursor-pointer px-4 py-1.5 text-sm rounded-md ${variantClass} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
