const Radio = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm text-slate-300">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-600 focus:ring-cyan-500"
    />
    {label}
  </label>
);
export default Radio;
