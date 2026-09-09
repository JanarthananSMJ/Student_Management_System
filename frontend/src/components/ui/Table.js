import React from 'react';
import { Search } from 'lucide-react';
import Spinner from './Spinner';
import EmptyState from './EmptyState';

export default function Table({
  columns,
  data = [],
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  searchValue,
  loading = false,
  emptyMessage = 'No records found',
  filters,
  rowKey = '_id',
}) {
  return (
    <div className="flex flex-col gap-3">
      {(searchable || filters) && (
        <div className="flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          )}
          {filters}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center">
                  <Spinner className="mx-auto" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10">
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row[rowKey] || idx} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
