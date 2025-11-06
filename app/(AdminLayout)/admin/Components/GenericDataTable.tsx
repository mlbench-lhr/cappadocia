"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
// import { ClipLoader } from "react-spinners"

// Reusable column definition
export interface Column<T> {
  header: string | React.ReactNode;
  accessor: keyof T | string;
  cell?: (row: T) => React.ReactNode;
}

interface GenericDataTableProps<T> {
  title?: string;
  tabs: string[];
  size?: string;
  custom_tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  data: T[]; // Make sure each item includes a `tab` field if using tab filtering
  columns: Column<T>[];
  pageSize?: number;
  customTabFilter?: (item: T, tab: string) => boolean;
  emptyStateImages?: { [title: string]: string };
  currentPage: number
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  querykey?: string
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  onAddUser?: (newUser: T) => void;
}

function GenericDataTable<T extends { id: string; tab?: string }>({
  title,
  tabs,
  size,
  custom_tabs,
  activeTab,
  onTabChange,
  customTabFilter,
  data,
  columns,
  emptyStateImages,
  pageSize = 10,
  currentPage,
  setCurrentPage,
  loading,
  setLoading,
  querykey,
  search,
  setSearch,
  onAddUser
}: GenericDataTableProps<T>) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);


  const tabFilteredData = useMemo(() => {
    if (!activeTab || !customTabFilter) return data;
    return data.filter((item) => customTabFilter(item, activeTab));
  }, [data, activeTab, customTabFilter]);

  const goToPage = (page: number) => {
    if (querykey) {
      if (setLoading) {
        setLoading(true);
      }
      const params = new URLSearchParams(searchParams);
      // setCurrentPage(page)
      params.set(querykey, String(page)); // update dynamic key
      router.push(`?${params.toString()}`);
    }
  };

  const isEmpty = tabFilteredData.length === 0;
  // 🔸 Derive fallback key if title is missing
  const fallbackTitle = !title && emptyStateImages
    ? Object.keys(emptyStateImages)[0]
    : undefined;

  // 🔹 Use title or fallback title
  const effectiveTitle = title || fallbackTitle;

  // 🔹 Get image path from effective title
  const emptyImage = effectiveTitle ? emptyStateImages?.[effectiveTitle] : null;


  // 📄 Paginate the filtered data
  const totalPages = tabs.length;
  const currentData = tabFilteredData;

  const handleAddUser = (newUser: any) => {
    onAddUser?.(newUser);
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl `}
      >
        <div
          className={`flex items-center justify-between flex-wrap gap-4 ${custom_tabs?.length ? "mb-4" : "mb-6"
            }`}
        >
          {/* Title*/}
          <div className={`flex ${tabs?.length ? "flex-col gap-2" : "items-center gap-4"}`}>
            {title && (
              <>
                <h1 className="text-2xl font-bold text-gray-800  font-raleway">
                  {title}
                </h1>
                <p className="text-sm opacity-50">{size}</p>
              </>
            )}
            {custom_tabs && custom_tabs.length > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 p-2  rounded-lg shadow-sm">
                {custom_tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => onTabChange?.(tab)}
                    className={`px-3 py-1 rounded-md text-sm border ${tab === activeTab
                      ? "bg-[var(--accent)] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="flex items-start gap-2">
            {/* {title && title === "All Users" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary px-4 py-2 rounded-lg w-[150px] font-medium text-white sm:text-base transition-colors cursor-pointer"
              >
                Add Users
              </button>
            )} */}
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  // setCurrentPage(1);
                }}
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <ClipLoader color="#465fff" size={30} />
          </div>
        ) : !loading && isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20">
            {emptyImage && (
              <Image src={emptyImage} width={300} height={200} alt="No data" className="mb-4 object-contain" />
            )}
            {/* {title && title === "All Users" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary mt-4 px-4 py-2.5 rounded-lg w-[200px] font-medium text-white sm:text-base transition-colors cursor-pointer"
              >
                Add Users
              </button>
            )} */}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto border p-4">
              <table className="min-w-full text-sm ">
                <thead>
                  <tr className="font-raleway text-black border-b">
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className={`py-2 px-4 font-medium text-left`}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-200 last:border-b-0">
                      {columns.map((col, i) => (
                        <td
                          key={i}
                          className={`py-4 px-4 font-raleway text-left`}
                        >
                          {col.cell ? col.cell(row) : (row as any)[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 gap-2">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
              >
                ← Previous
              </button>
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => goToPage(Number(tab))}
                    className={`w-9 h-9 rounded-md text-sm ${currentPage === Number(tab)
                      ? "bg-[#B32053] text-white"
                      : "text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="px-6 py-2 border rounded-md text-sm disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}

      </div>

    </>
  );
}

export default GenericDataTable;
