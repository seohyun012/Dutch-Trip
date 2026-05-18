export default function Button({
  label,
  onClick,
  disabled,
  fixed,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  fixed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-4 rounded-2xl text-white font-bold text-2xl active:scale-[0.98] transition-all ${
        disabled ? "bg-[#C0C0C0]" : "bg-[#0C6DFF]"
      } ${fixed ? "fixed bottom-4 left-5 right-5" : ""}`}
    >
      {label}
    </button>
  );
}
