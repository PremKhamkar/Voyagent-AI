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
      className={`bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;