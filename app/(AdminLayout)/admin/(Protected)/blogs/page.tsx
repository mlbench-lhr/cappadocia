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
import { BasicStructureWithName } from "@/components/providers/BasicStructureWithName";
import { ServerPaginationProvider } from "@/components/providers/PaginationProvider";
import { NoDataComponent } from "@/components/SmallComponents/NoDataComponent";
import { BoxProviderWithName } from "@/components/providers/BoxProviderWithName";

export default function AllBlogs() {
  const [loading, setLoading] = useState(true);
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

  const BookingsLoadingSkeleton = () => (
    <div className="w-full space-y-2 animate-pulse">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-10 md:h-16 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
  const NoBookingsFound = () => <NoDataComponent text="No Blogs Added Yet" />;
  return (
    <BasicStructureWithName
      name="Blogs"
      showBackOption
      rightSideComponent={
        <div className="w-full mb-4 flex justify-end items-center flex-wrap gap-y-2">
          <div className="flex justify-start items-center md:gap-x-4 gap-y-2 flex-wrap w-fit">
            <div className="relative w-full md:w-[325px] h-[50px]">
              <Search className="absolute left-3 top-[17px] h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-[325px] h-[50px] rounded-[10px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AddDialog setRefreshData={setRefreshData} />
          </div>
        </div>
      }
    >
      <ServerPaginationProvider<{
        data: any[];
        pagination: {
          total: number;
          page: number;
          totalPages: number;
        };
      }>
        apiEndpoint="/api/admin/blogs" // Your API endpoint
        queryParams={{
          search: searchTerm,
        }}
        LoadingComponent={BookingsLoadingSkeleton}
        NoDataComponent={NoBookingsFound}
        itemsPerPage={7}
        refreshData={refreshData}
      >
        {(data, isLoading, refetch) => {
          return (
            <BoxProviderWithName name="">
              <DynamicTable
                data={data}
                columns={columns}
                itemsPerPage={7}
                onRowClick={(item) => console.log("Clicked:", item)}
                isLoading={loading}
                showImage
                type="Blogs"
              />
            </BoxProviderWithName>
          );
        }}
      </ServerPaginationProvider>
    </BasicStructureWithName>
  );
}
