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
    <div className="">
      <div className="p-5 h-screen bg-gray-100">
        <h1 className="text-xl mb-2">User Management</h1>
        <div className="overflow-auto rounded-lg shadow">
          <table
            {...getTableProps()}
            className="w-full table-auto"
          >
            <thead className="bg-gray-900 text-white">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="p-3 text-sm font-semibold text-center tracking-wide border-b border-gray-300"
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
                  <tr
                    {...row.getRowProps()}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition-colors duration-200"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="p-3 text-sm font-medium text-gray-700 whitespace-nowrap text-center border-b border-gray-300"
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
    </div>
  );
}

export default AdminTable;
