"use client";

export default function Input({ label, placeholder, value, onChange, type = "text", error = "", id }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12.5px] font-medium text-[#1a1a18]">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          px-3 py-2 text-[13.5px] rounded-md border bg-white text-[#1a1a18]
          outline-none transition-all duration-150
          ${error
            ? "border-[#E24B4A] focus:ring-2 focus:ring-[#E24B4A]/20"
            : "border-black/[0.09] focus:border-[#639922] focus:ring-2 focus:ring-[#639922]/10"
          }
        `}
      />
      {error && <p className="text-[11px] text-[#E24B4A]">{error}</p>}
    </div>
  );
}
