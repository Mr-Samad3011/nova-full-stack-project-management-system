
// eslint-disable-next-line no-unused-vars
import React from "react";


// =====================================================
// SORT SELECT
// =====================================================

const SortSelect = ({
  value,
  onChange,
  options = [],
  label = "Sort By",
  id = "sort-select",
}) => {

  return (
    <div className="w-full">

      {/* =================================================
          LABEL
      ================================================= */}

      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>


      {/* =================================================
          SELECT
      ================================================= */}

      <select
        id={id}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      >

        {options.map((option) => (

          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>

        ))}

      </select>

    </div>
  );
};


export default SortSelect;
