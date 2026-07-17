function Input({
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        border
        border-gray-300
        rounded-lg
        px-4
        py-3
        outline-none
        focus:border-blue-500
      "
    />
  );
}

export default Input;