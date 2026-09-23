"use client";

import { useState, useEffect } from "react";

function toLineValue(value) {
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.join("\n");
    } catch {
      return value;
    }
  }
  return value || "";
}

function toPairLineValue(value) {
  const pairs = (() => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();

  return pairs
    .map((pair) => {
      if (Array.isArray(pair)) return `${pair[0] || ""} | ${pair[1] || ""}`;
      if (pair && typeof pair === "object") {
        return `${pair.url || pair.link || ""} | ${pair.label || pair.title || ""}`;
      }
      return String(pair || "");
    })
    .join("\n");
}

function prepareInitialForm(initialData, fields) {
  const next = { ...initialData };
  fields.forEach((field) => {
    if (field.type === "stringlist") {
      next[field.name] = toLineValue(next[field.name]);
    }
    if (field.type === "pairlist") {
      next[field.name] = toPairLineValue(next[field.name]);
    }
    if (!initialData.id && field.type === "select" && !next[field.name]) {
      next[field.name] = "";
    }
    if (field.type === "multiselect" && !Array.isArray(next[field.name])) {
      next[field.name] = [];
    }
  });
  return next;
}

function serializeForm(formData, fields) {
  const payload = { ...formData };
  fields.forEach((field) => {
    if (field.type === "stringlist") {
      payload[field.name] = JSON.stringify(
        String(formData[field.name] || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      );
    }
    if (field.type === "pairlist") {
      payload[field.name] = JSON.stringify(
        String(formData[field.name] || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [left, ...rest] = line.split("|");
            return [left.trim(), rest.join("|").trim()];
          })
          .filter((pair) => pair[0] && pair[1])
      );
    }
  });
  return payload;
}

export default function EditModal({ isOpen, onClose, onSave, title, fields, initialData = {} }) {
  const [formData, setFormData] = useState(() => prepareInitialForm(initialData, fields));

  useEffect(() => {
    if (isOpen) {
      setFormData(prepareInitialForm(initialData, fields));
    }
  }, [initialData, isOpen, fields]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = fields
      .filter((field) => {
        if (!field.required) return false;
        const value = formData[field.name];
        if (field.type === "multiselect") {
          return !Array.isArray(value) || value.length === 0;
        }
        return value === null || value === undefined || value === "";
      })
      .map((field) => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    onSave(serializeForm(formData, fields));
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeMultiValue = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const toggleMultiValue = (fieldName, optionValue) => {
    const current = normalizeMultiValue(formData[fieldName]);
    const exists = current.includes(optionValue);
    const next = exists
      ? current.filter((value) => value !== optionValue)
      : [...current, optionValue];
    handleChange(fieldName, next);
  };

  const inputClass =
    "w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none";

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-500/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {field.label}
              </label>
              {field.type === "textarea" || field.type === "stringlist" || field.type === "pairlist" ? (
                <textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={inputClass}
                  rows={field.rows || (field.type === "textarea" ? 4 : 6)}
                  required={field.required}
                  placeholder={
                    field.placeholder ||
                    (field.type === "stringlist"
                      ? "One item per line"
                      : field.type === "pairlist"
                        ? "url | label"
                        : undefined)
                  }
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={inputClass}
                  required={field.required}
                >
                  <option value="">-- Select {field.label} --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "number" ? (
                <input
                  type="number"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, parseInt(e.target.value))}
                  className={inputClass}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                />
              ) : field.type === "multiselect" ? (
                <div className="rounded-lg border border-orange-500/30 bg-gray-900/30 p-3">
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {field.options?.map((opt) => {
                      const selected = normalizeMultiValue(formData[field.name]).includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleMultiValue(field.name, opt.value)}
                            className="accent-orange-500"
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {normalizeMultiValue(formData[field.name]).length > 0 ? (
                    <p className="text-xs text-gray-400 mt-2">
                      Selected: {normalizeMultiValue(formData[field.name]).join(", ")}
                    </p>
                  ) : null}
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={inputClass}
                  required={field.required}
                />
              )}
              {field.helpText ? (
                <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
              ) : null}
            </div>
          ))}

          <div className="flex gap-4 mt-6 sticky bottom-0 bg-[#111]/90 backdrop-blur py-3">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
