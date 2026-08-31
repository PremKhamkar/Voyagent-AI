function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        h-14
        w-full
        rounded-2xl
        bg-cyan-600
        px-6
        font-semibold
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-cyan-700
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;