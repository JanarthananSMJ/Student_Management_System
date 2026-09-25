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
  // Spread columns across the full table width: first real column hugs the
  // left edge, the last real column (before any trailing actions column)
  // hugs the right edge, and anything in between is centered.
  const realIdxs = columns.map((c, i) => (c.key === 'actions' ? -1 : i)).filter((i) => i !== -1);
  const firstIdx = realIdxs[0];
  const lastIdx = realIdxs[realIdxs.length - 1];
  const alignClass = (idx, key) => {
    if (key === 'actions') return 'text-right';
    if (idx === firstIdx) return 'text-left';
    if (idx === lastIdx) return 'text-right';
    return 'text-center';
  };

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
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-10 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${alignClass(
                    idx,
                    col.key,
                  )}`}
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
                  {columns.map((col, idx) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-10 py-3 text-sm text-gray-700 ${alignClass(idx, col.key)}`}
                    >
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
