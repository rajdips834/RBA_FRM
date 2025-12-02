const Panel = ({ title, children }) => (
  <div className="flex flex-col flex-1 h-full w-full bg-slate-800/50 p-1 rounded-xl shadow-lg ring-1 ring-slate-700">
    <h2 className="text-base font-semibold text-slate-300 px-4 pt-3">
      {title}
    </h2>
    <div className="p-4 pt-2 flex-1 flex flex-col">{children}</div>
  </div>
);
export default Panel;
