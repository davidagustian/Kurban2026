export default function Badge({ children, variant = "green" }) {
  const variants = {
    green: "bg-[#EAF3DE] text-[#3B6D11]",
    blue: "bg-[#E6F1FB] text-[#185FA5]",
    amber: "bg-[#FAEEDA] text-[#854F0B]",
    red: "bg-[#FCEBEB] text-[#A32D2D]",
    gray: "bg-[#F1EFE8] text-[#5F5E5A]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
