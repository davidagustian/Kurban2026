"use client";

export default function Select({ label, value, onChange, options = [], placeholder = "Pilih...", error = "", id }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12.5px] font-medium text-[#1a1a18]">
          {label}
        </label>
      )}
      <select
        id={id}
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
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-[11px] text-[#E24B4A]">{error}</p>}
    </div>
  );
}
