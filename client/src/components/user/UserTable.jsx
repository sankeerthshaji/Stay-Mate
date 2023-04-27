import React from "react";
import { useTable } from "react-table";

function UserTable(props) {
  const tableInstance = useTable({
    columns: props.columns,
    data: props.data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="overflow-auto rounded-lg shadow">
      <table {...getTableProps()} className="w-full table-auto">
        <thead className="bg-gray-900 text-white">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="p-3 text-base font-semibold text-center tracking-wide border-b border-gray-300"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white">
          {rows.map((row, i) => {
            prepareRow(row);

            return (
              <>
                <tr
                  {...row.getRowProps()}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-200"
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="p-3 text-sm font-medium text-gray-700 text-center border-b border-gray-300 break-words"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
