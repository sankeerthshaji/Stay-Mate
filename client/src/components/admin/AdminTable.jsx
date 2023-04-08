import React from "react";
import { useTable } from "react-table";

function AdminTable(props) {
  
  const tableInstance = useTable({
    columns: props.columns,
    data: props.data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="flex-grow p-3">
      <h1 className="text-3xl font-bold mb-5">User Management</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table
          {...getTableProps()}
          className="w-full min-w-full border-collapse"
        >
          <thead className="bg-[#081A51] text-white border-b-2 border-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="p-4 font-bold text-left uppercase tracking-wider w-[25%]"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="divide-y divide-gray-300 bg-white"
          >
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-200">
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="p-4 whitespace-nowrap w-[25%]"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;
