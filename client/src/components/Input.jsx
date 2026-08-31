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
        h-12
        w-full
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        px-4
        text-sm
        text-slate-800
        placeholder:text-slate-400
        outline-none
        transition-all
        duration-200
        hover:border-slate-300
        hover:bg-white
        focus:border-cyan-500
        focus:bg-white
        focus:ring-4
        focus:ring-cyan-500/10
        [&:-webkit-autofill]:bg-slate-50
        [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(248_250_252)]
      "
    />
  );
}

export default Input;