const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  inputMode,
}) => {
  // Only allow numeric input for fields with inputMode="numeric"
  // Only allow MM/YY for expiry fields
  const handleInput = (e) => {
    if (name && (name.includes("expiry") || name.includes("Expiry"))) {
      // Allow only MM/YY format: up to 5 chars, only digits and one slash at pos 2
      let val = e.target.value.replace(/[^0-9/]/g, "");
      // Prevent more than one slash
      val = val.replace(/\//g, (match, offset) => (offset === 2 ? "/" : ""));
      // Enforce slash at position 2
      if (val.length > 2) {
        val = val.slice(0, 2) + "/" + val.slice(3).replace(/\//g, "");
      }
      // Limit to 5 chars
      val = val.slice(0, 5);
      if (val !== e.target.value) {
        e.target.value = val;
        if (onChange) {
          const event = { ...e, target: { ...e.target, value: val } };
          onChange(event);
          return;
        }
      }
    } else if (inputMode === "numeric") {
      const cleaned = e.target.value.replace(/[^0-9]/g, "");
      if (cleaned !== e.target.value) {
        e.target.value = cleaned;
        // Fire onChange with cleaned value
        if (onChange) {
          // Create a synthetic event with cleaned value
          const event = { ...e, target: { ...e.target, value: cleaned } };
          onChange(event);
          return;
        }
      }
    }
    if (onChange) onChange(e);
  };
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-medium text-slate-400 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ""}
        onChange={handleInput}
        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-200"
        placeholder={placeholder}
        {...(maxLength ? { maxLength } : {})}
        {...(inputMode ? { inputMode } : {})}
      />
    </div>
  );
};
export default Input;
