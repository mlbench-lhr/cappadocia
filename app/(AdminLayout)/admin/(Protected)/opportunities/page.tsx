"use client";
export const dynamic = "force-dynamic";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Input } from "@/components/ui/input";
import { Plus, Search, Upload } from "lucide-react";
import { Column, DynamicTable } from "../../Components/Table/page";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { ImportDialog } from "@/components/Import-dialog";

export default function AllOpp() {
  const [loading, setLoading] = useState(true);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [data, setData] = useState<{
    users: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    users: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function getUsers() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          ...(debouncedSearch && { search: debouncedSearch }),
        });

        const allUsers = await axios.get(
          `/api/admin/opportunities?${params.toString()}`
        );
        setData(allUsers.data);
      } catch (error) {
        console.log("error----", error);
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, [currentPage, debouncedSearch]);

  // Handle CSV import from dialog
  const handleImportFile = async (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      trimHeaders: true,
      transformHeader: (header: string) => header.trim(),
      complete: async function (results) {
        const fileJson = results.data;

        // Filter out empty objects
        const validData = fileJson.filter((item: any) => {
          return (
            item &&
            Object.keys(item)?.length > 0 &&
            Object.values(item).some((val) => val !== null && val !== "")
          );
        });

        const payloadJson = validData.map((item: any) => {
          return {
            description: item.Description || item.description || "",
            type:
              (item.Format || item.format) === "Virtual"
                ? "Online"
                : item.Format || item.format || "",
            link: item.Link || item.link || "",
            title: item.Name || item.name || item.Title || item.title || "",
            category:
              item.Type || item.type || item.Category || item.category || "",
            majors:
              item.Theme || item.theme || item.Majors || item.majors || "",
          };
        });

        try {
          setImportLoading(true);
          // Replace with your actual API endpoint
          const response = await fetch("/api/opportunities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ opportunities: payloadJson }),
          });

          if (response.ok) {
            // Refresh the list after successful import
            setCurrentPage(1);
            setSearchTerm("");
            // Trigger re-fetch by updating a dependency
            const params = new URLSearchParams({
              page: "1",
              limit: "10",
            });
            const allUsers = await axios.get(
              `/api/admin/opportunities?${params.toString()}`
            );
            setData(allUsers.data);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: `Successfully imported ${payloadJson?.length} opportunities!`,
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            const errorData = await response.json();
            console.error("Failed to import opportunities:", errorData);
          }
          setImportLoading(false);
          setIsImportDialogOpen(false);
        } catch (error) {
          console.error("Error saving opportunities:", error);
        }
      },
    });
  };

  const columns: Column[] = [
    {
      header: "ID",
      accessor: "id",
      nameAccessor: "id",
      subtitleAccessor: "id",
      render: (item) => <span>#{item.id.replace(/\D/g, "").slice(-5)}</span>,
    },
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Category",
      accessor: "category",
    },
    {
      header: "Deadline",
      accessor: "dueDate",
      render: (item) => (
        <span>{moment(item.dueDate).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      header: "Difficulty",
      accessor: "difficulty",
      render: (item) => {
        console.log(item.difficulty);

        return (
          <span className={`capitalize ${"badge-" + item.difficulty}`}>
            {item.difficulty}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: "role",
      render: (item) => (
        <Link
          href={`/admin/opportunities/detail/${item.id}`}
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
                All Opportunities
              </h1>
              <h1 className="text-lg md:text-xl font-semibold text-[#51606E]">
                Total Opportunities: {data.total}
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
              <Link
                href={`/admin/opportunities/add`}
                className="col-span-2 md:col-span-1"
              >
                <Button variant={"green_secondary_button"} className="w-full">
                  <Plus />
                  Add Opportunity
                </Button>
              </Link>
              <Button
                variant={"main_green_button"}
                onClick={() => setIsImportDialogOpen(true)}
                className="flex gap-2 col-span-2 md:col-span-1"
              >
                <Upload className="w-4 h-4" /> Import
              </Button>
            </div>
          </div>

          <DynamicTable
            data={data.users}
            columns={columns}
            itemsPerPage={7}
            onRowClick={(item) => console.log("Clicked:", item)}
            isLoading={loading}
            // Server-side pagination props
            serverPagination={{
              currentPage: currentPage,
              totalPages: data.totalPages,
              onPageChange: setCurrentPage,
            }}
            type="Opportunities"
          />
        </div>
      </div>

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportFile}
        importLoading={importLoading}
      />
    </AdminLayout>
  );
}
