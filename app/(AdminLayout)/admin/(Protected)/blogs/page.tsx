"use client";
export const dynamic = "force-dynamic";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Column, DynamicTable } from "../../Components/Table/page";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import AddDialog from "./AddDialog/page";

export default function AllBlogs() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    blogs: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    blogs: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshData, setRefreshData] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function getblogs() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          ...(debouncedSearch && { search: debouncedSearch }),
        });

        let allblogs = await axios.get(`/api/admin/blogs?${params.toString()}`);
        setData(allblogs.data);
        setLoading(false);
      } catch (error) {
        console.log("error----", error);
        setLoading(false);
      }
    }
    getblogs();
  }, [currentPage, refreshData, debouncedSearch]);

  const columns: Column[] = [
    {
      header: "Sr No",
      accessor: "srNo",
    },
    {
      header: "Blogs Title",
      accessor: "title",
    },
    {
      header: "Published On",
      accessor: "createdAt",
      render: (item) => (
        <span>{moment(item.createdAt).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      header: "Action",
      accessor: "role",
      render: (item) => (
        <Link
          href={`/admin/blogs/detail/${item._id}`}
          className="text-[#B32053] underline"
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen w-full">
        <div className="w-full mx-auto">
          <div className="w-full mb-4 flex justify-between items-center flex-wrap gap-y-2">
            <div className="w-full md:w-fit mb-0 space-y-[5px]">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                All Blogs
              </h1>
              <h1 className="text-lg md:text-xl font-semibold text-[#51606E]">
                Total Blogs: {data.total}
              </h1>
            </div>
            <div className="grid grid-cols-2 md:flex justify-end items-center gap-4 flex-wrap lg:w-fit w-full">
              <div className="col-span-2 relative w-full md:w-[325px] h-[50px]">
                <Search className="absolute left-3 top-[17px] h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-full md:w-[325px] h-[50px] rounded-[10px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <AddDialog setRefreshData={setRefreshData} />
            </div>
          </div>
          <DynamicTable
            data={data.blogs}
            columns={columns}
            itemsPerPage={7}
            onRowClick={(item) => console.log("Clicked:", item)}
            isLoading={loading}
            showImage
            // Server-side pagination props
            serverPagination={{
              currentPage: currentPage,
              totalPages: data.totalPages,
              onPageChange: setCurrentPage,
            }}
            type="Blogs"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
