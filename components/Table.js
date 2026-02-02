import React from "react";
import PropTypes from "prop-types";

const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-sm font-bold text-gray-600 uppercase">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="p-4 text-gray-800">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClick: PropTypes.func,
};

export default Table;