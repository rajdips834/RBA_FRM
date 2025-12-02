import React, { useMemo, useState } from "react";
import Panel from "../components/core/Panel";
import Input from "../components/core/Input";
import { generateDatasetWithFraud, toCSV } from "../utils/csdRandomUtils";
import AttributeRowEditor from "../csd_components/AttributeRowEditor";
import { ArrowLeft, Download, Plus, RefreshCw, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CSDAttributeTool() {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState([
    { name: "ID", type: "alphanumeric", config: { length: 6 } },
    { name: "DerogCnt", type: "integer", config: { min: 0, max: 5 } },
  ]);
  const [totalRecords, setTotalRecords] = useState(1000);
  const [fraudRecords, setFraudRecords] = useState(100);
  const [dataset, setDataset] = useState([]);

  const csv = useMemo(() => toCSV(dataset), [dataset]);

  const addAttribute = () =>
    setAttributes([...attributes, { name: "", type: "integer", config: {} }]);
  const updateAttribute = (idx, next) =>
    setAttributes((prev) => prev.map((a, i) => (i === idx ? next : a)));
  const removeAttribute = (idx) =>
    setAttributes((prev) => prev.filter((_, i) => i !== idx));

  const handleGenerate = () => {
    setDataset(
      generateDatasetWithFraud(
        attributes,
        totalRecords,
        Math.min(fraudRecords, totalRecords)
      )
    );
  };

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "csd_dataset.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      <header className="bg-slate-900/70 backdrop-blur-lg p-4 border-b border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Upload size={18} className="text-cyan-400" /> CSD Attribute Builder
          </h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          <Panel title="Controls">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="pb-4">
                <Input
                  label="Total Records"
                  type="number"
                  min="1"
                  max="200000"
                  value={totalRecords}
                  onChange={(e) => {
                    const next = Math.max(1, Number(e.target.value || 0));
                    setTotalRecords(next);
                    if (fraudRecords > next) setFraudRecords(next); // clamp fraud count
                  }}
                />
              </div>
              <div className="relative pb-4">
                <Input
                  label="Fraud Records"
                  type="number"
                  min="0"
                  max={totalRecords}
                  value={fraudRecords}
                  onChange={(e) =>
                    setFraudRecords(
                      Math.min(Math.max(0, Number(e.target.value || 0)), totalRecords)
                    )
                  }
                />
                <div className="absolute left-0 top-full mt-1 text-[10px] text-slate-400">
                  {((fraudRecords / totalRecords) * 100).toFixed(1)}% fraud
                </div>
              </div>
              <div className="flex gap-2 col-span-1 md:col-span-3 md:justify-end">
                <button
                  onClick={addAttribute}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} /> Add Attribute
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2"
                >
                  <RefreshCw size={16} /> Generate
                </button>
                <button
                  onClick={downloadCSV}
                  disabled={!dataset.length}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center gap-2"
                >
                  <Download size={16} /> Download CSV
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {attributes.map((attr, idx) => (
                <AttributeRowEditor key={idx} attr={attr} idx={idx} onChange={updateAttribute} onRemove={removeAttribute} />
              ))}
            </div>
          </Panel>

          <Panel title={`Preview Table (first ${Math.min(20, dataset.length)} rows)`}>
            {dataset.length ? (
              <div className="overflow-auto border border-slate-700 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-800/60">
                    <tr>
                      {Object.keys(dataset[0])
                        .slice(0, 50) // safety cap
                        .map((h) => (
                          <th
                            key={h}
                            className="text-left px-3 py-2 font-semibold text-slate-200 whitespace-nowrap border-b border-slate-700"
                          >
                            {h}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.slice(0, 20).map((row, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0
                            ? "bg-slate-900"
                            : "bg-slate-800/40"
                        }
                      >
                        {Object.keys(dataset[0])
                          .slice(0, 50)
                          .map((h) => (
                            <td
                              key={h}
                              className="px-3 py-1.5 border-b border-slate-800 text-slate-300 whitespace-nowrap"
                            >
                              {String(row[h])}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No data yet. Configure attributes then click Generate.</p>
            )}
            <div className="text-xs mt-3 text-slate-400">
              Generated {dataset.length.toLocaleString()} rows | Fraud: {Math.min(fraudRecords, totalRecords).toLocaleString()} | Genuine: {(dataset.length - Math.min(fraudRecords, totalRecords)).toLocaleString()}
            </div>
          </Panel>
          <Panel title="Preview CSV">
            <pre className="text-xs overflow-auto whitespace-pre text-slate-200 max-h-72">{csv || "(No data yet)"}</pre>
          </Panel>
        </div>
      </main>
    </div>
  );
}
