import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-4 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 ${props.className}`}
    >
      {children}
    </button>
  );
};

export default Button;
