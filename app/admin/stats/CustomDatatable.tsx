// components/CustomDataTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CustomDataTableProps<T> = {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export default function CustomDataTable<T extends Record<string, any>>({
  title = "Data Table",
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  searchable = true,
  searchPlaceholder = "Search...",
}: CustomDataTableProps<T>) {
  const [filterText, setFilterText] = useState("");

  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
  }, [data, filterText]);

  const actionColumn: TableColumn<T> = {
    name: "Actions",
    cell: (row: any) => (
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(row)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  };

  const finalColumns = [
    ...columns,
    ...(onEdit || onDelete ? [actionColumn] : []),
  ];

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            {onAdd && (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAdd}>
                <Plus className="h-4 w-4 mr-2" />
                {`Add`}
              </Button>
            )}
          </div>
        </div>
      </div>

      <DataTable
        columns={finalColumns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
      />
    </div>
  );
}
