import React from "react";
import Input from "../components/core/Input";
import Select from "../components/core/Select";

const typeOptions = [
  { value: "integer", label: "Integer" },
  { value: "float", label: "Float" },
  { value: "string", label: "String" },
  { value: "alphanumeric", label: "Alphanumeric" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "enum", label: "Enum" },
];

export default function AttributeRowEditor({ attr, idx, onChange, onRemove }) {
  const handle = (field, value) => onChange(idx, { ...attr, [field]: value });
  const handleConfig = (field, value) =>
    onChange(idx, { ...attr, config: { ...(attr.config || {}), [field]: value } });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
      <div className="md:col-span-3">
        <Input
          label="Attribute Name"
          placeholder="e.g., TLDel60Cnt24"
          value={attr.name}
          onChange={(e) => handle("name", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <Select
          label="Type"
          name="type"
          value={attr.type}
          onChange={(e) => handle("type", e.target.value)}
          options={typeOptions}
        />
      </div>

      {/* Dynamic config fields */}
      {attr.type === "integer" && (
        <>
          <div className="md:col-span-2">
            <Input label="Min" type="number" value={attr.config?.min ?? ""} onChange={(e) => handleConfig("min", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Input label="Max" type="number" value={attr.config?.max ?? ""} onChange={(e) => handleConfig("max", e.target.value)} />
          </div>
        </>
      )}

      {attr.type === "float" && (
        <>
          <div className="md:col-span-2">
            <Input label="Min" type="number" value={attr.config?.min ?? ""} onChange={(e) => handleConfig("min", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Input label="Max" type="number" value={attr.config?.max ?? ""} onChange={(e) => handleConfig("max", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Input label="Decimals" type="number" value={attr.config?.decimals ?? 2} onChange={(e) => handleConfig("decimals", e.target.value)} />
          </div>
        </>
      )}

      {attr.type === "string" && (
        <>
          <div className="md:col-span-2">
            <Input label="Length" type="number" value={attr.config?.length ?? 8} onChange={(e) => handleConfig("length", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Select
              label="Casing"
              name="casing"
              value={attr.config?.casing || "mixed"}
              onChange={(e) => handleConfig("casing", e.target.value)}
              options={[{ value: "lower", label: "lower" }, { value: "upper", label: "upper" }, { value: "mixed", label: "mixed" }]}
            />
          </div>
        </>
      )}

      {attr.type === "alphanumeric" && (
        <div className="md:col-span-2">
          <Input label="Length" type="number" value={attr.config?.length ?? 10} onChange={(e) => handleConfig("length", e.target.value)} />
        </div>
      )}

      {attr.type === "boolean" && (
        <div className="md:col-span-2">
          <Input label="True %" type="number" value={attr.config?.truePercent ?? 50} onChange={(e) => handleConfig("truePercent", e.target.value)} />
        </div>
      )}

      {attr.type === "date" && (
        <>
          <div className="md:col-span-3">
            <Input label="Start Date" type="date" value={attr.config?.startDate ?? ""} onChange={(e) => handleConfig("startDate", e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <Input label="End Date" type="date" value={attr.config?.endDate ?? ""} onChange={(e) => handleConfig("endDate", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Select
              label="Format"
              name="format"
              value={attr.config?.format || "YYYY-MM-DD"}
              onChange={(e) => handleConfig("format", e.target.value)}
              options={[{ value: "YYYY-MM-DD", label: "YYYY-MM-DD" }, { value: "ISO", label: "ISO" }]}
            />
          </div>
        </>
      )}

      {attr.type === "enum" && (
        <div className="md:col-span-4">
          <Input
            label="Values (comma separated)"
            placeholder="A,B,C"
            value={(attr.config?.values || []).join(",")}
            onChange={(e) => handleConfig("values", e.target.value.split(",").map((s) => s.trim()))}
          />
        </div>
      )}

      <div className="md:col-span-1">
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 px-3 rounded-lg"
          title="Remove attribute"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
