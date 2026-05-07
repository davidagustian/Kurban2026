export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`
        bg-white rounded-[10px] border border-black/[0.09] shadow-sm
        ${hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-md" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
