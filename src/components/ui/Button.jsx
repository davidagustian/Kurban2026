"use client";

export default function Button({ children, onClick, variant = "primary", type = "button", className = "" }) {
  const base =
    "inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 border";

  const variants = {
    primary:
      "bg-[#639922] text-white border-[#639922] hover:bg-[#3B6D11] hover:shadow-lg active:scale-95",
    secondary:
      "bg-white text-[#5F5E5A] border-[rgba(0,0,0,0.12)] hover:bg-[#F1EFE8] active:scale-95",
    ghost:
      "bg-transparent text-[#639922] border-transparent hover:bg-[#EAF3DE] active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
