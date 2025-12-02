// Utilities to generate random values for CSD attributes

const randInt = (min = 0, max = 100) => {
  const a = Number(min);
  const b = Number(max);
  if (Number.isNaN(a) || Number.isNaN(b)) return Math.floor(Math.random() * 101);
  if (a > b) return randInt(b, a);
  return Math.floor(Math.random() * (b - a + 1)) + a;
};

const randFloat = (min = 0, max = 1, decimals = 2) => {
  const lo = Number(min);
  const hi = Number(max);
  const d = Math.max(0, Number(decimals) || 0);
  const val = lo + Math.random() * (hi - lo);
  return Number(val.toFixed(d));
};

const alpha = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";

const randString = (len = 8, { casing = "mixed", alphabet = alpha } = {}) => {
  let chars = alphabet;
  if (casing === "upper") chars = alphabet.toUpperCase();
  if (casing === "mixed") chars = alphabet + alphabet.toUpperCase();
  let out = "";
  for (let i = 0; i < Math.max(0, Number(len) || 0); i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

const randAlphanumeric = (len = 10) => {
  const chars = alpha + alpha.toUpperCase() + digits;
  let out = "";
  for (let i = 0; i < Math.max(0, Number(len) || 0); i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

const randBoolean = (truePct = 50) => Math.random() * 100 < Number(truePct || 0);

const randDate = (start, end, format = "YYYY-MM-DD") => {
  const startDate = start ? new Date(start) : new Date("2000-01-01");
  const endDate = end ? new Date(end) : new Date();
  const t = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const d = new Date(t);
  const pad = (n) => String(n).padStart(2, "0");
  if (format === "ISO") return d.toISOString();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export function generateRandomValue(attr) {
  const { type, config = {} } = attr;
  switch (type) {
    case "integer":
      return randInt(config.min ?? 0, config.max ?? 1000);
    case "float":
      return randFloat(config.min ?? 0, config.max ?? 1, config.decimals ?? 2);
    case "string":
      return randString(config.length ?? 8, { casing: config.casing || "mixed" });
    case "alphanumeric":
      return randAlphanumeric(config.length ?? 10);
    case "boolean":
      return randBoolean(config.truePercent ?? 50);
    case "date":
      return randDate(config.startDate, config.endDate, config.format || "YYYY-MM-DD");
    case "enum": {
      const values = (config.values || []).filter((v) => v !== "");
      if (!values.length) return null;
      return values[Math.floor(Math.random() * values.length)];
    }
    default:
      return null;
  }
}

export function generateDataset(attributes, count = 10) {
  const rows = [];
  const n = Math.max(0, Number(count) || 0);
  for (let i = 0; i < n; i++) {
    const row = {};
    for (const attr of attributes) {
      if (!attr?.name) continue;
      row[attr.name] = generateRandomValue(attr);
    }
    rows.push(row);
  }
  return rows;
}

// Generate dataset and add an is_fraud label column based on desired fraud count.
// attributes: attribute definitions (without label)
// total: total number of rows requested
// fraudCount: number of rows to label as fraud (clamped to total)
// labelField: name of the fraud label column (default 'is_fraud')
export function generateDatasetWithFraud(attributes, total = 100, fraudCount = 0, labelField = "is_fraud") {
  const n = Math.max(0, Number(total) || 0);
  const f = Math.min(Math.max(0, Number(fraudCount) || 0), n);
  const base = generateDataset(attributes, n);
  // Select f unique indices for fraud.
  const indices = Array.from({ length: n }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const fraudSet = new Set(indices.slice(0, f));
  for (let i = 0; i < n; i++) {
    base[i][labelField] = fraudSet.has(i) ? 1 : 0; // 1 = fraud, 0 = genuine
  }
  return base;
}

export function toCSV(rows) {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes("\n") || s.includes('"'))
      return '"' + s.replaceAll('"', '""') + '"';
    return s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h])).join(","));
  }
  return lines.join("\n");
}
