"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { PencilLine, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import Swal from "sweetalert2";
import axios from "axios";
import { Column, DynamicTable } from "../../Components/Table/page";
import moment from "moment";
import Link from "next/link";
import { fieldNames } from "./[fieldName]/page";

const columns: Column[] = [
  {
    header: "S.No.",
    accessor: "srNo",
  },
  {
    header: "Survey Name",
    accessor: "name",
    render: (item) => <span>{fieldNames?.[item.name]}</span>,
  },
  {
    header: "Total Entries",
    accessor: "count",
  },
  {
    header: "Updated On",
    accessor: "createdAt",
    render: (item) => (
      <span>{moment(item.createdAt).format("MMM DD, YYYY")}</span>
    ),
  },
  {
    header: "Action",
    accessor: "role",
    render: (item) => (
      <div className="bg-[#B32053] w-fit h-fit p-[5px] rounded-[4px]">
        <Link
          href={`/admin/surveyFields/${item.name}`}
          className="bg-[#B32053] w-fit h-fit"
        >
          <PencilLine color="white" size={12} />
        </Link>
      </div>
    ),
  },
];

export default function AddMilestoneField() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFields() {
      try {
        setLoading(true);
        const response = await axios.get("/api/profile-fields");
        setData(response.data?.fields || []);
        setFilteredData(response.data?.fields || []);
      } catch (error) {
        console.error("Error fetching milestone fields", error);
        Swal.fire("Error", "Failed to load survey fields.", "error");
      } finally {
        setLoading(false);
      }
    }
    getFields();
  }, []);
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = data.filter(
      (item: any) =>
        item?.name?.toLowerCase().includes(term) ||
        fieldNames?.[item.name]?.toLowerCase().includes(term)
    );
    setFilteredData(results);
  }, [searchTerm, data]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-[24px] flex flex-col gap-[32px] justify-start items-start w-full">
          <div className="box-shadows-2 py-[24px] flex flex-col gap-[32px] justify-start items-start w-full relative">
            <div className="flex justify-start items-center gap-[12px] flex-col">
              Loading...
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full">
        <div className="w-full mx-auto">
          <div className="w-full mb-8 flex justify-between items-center flex-wrap gap-y-2">
            <div className="w-full md:w-fit mb-0 space-y-[5px]">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Profile Survey
              </h1>
              <h1 className="text-lg md:text-xl font-semibold text-[#51606E]">
                Total Fields: 06
              </h1>
            </div>
            <div className="col-span-2 relative w-full md:w-[325px] h-[50px]">
              <Search className="absolute left-3 top-[17px] h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full md:w-[325px] h-[50px] rounded-[10px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DynamicTable
          data={filteredData}
          columns={columns}
          itemsPerPage={7}
          onRowClick={(item) => console.log("Clicked:", item)}
          isLoading={loading}
          type="Data"
        />
      </div>
    </AdminLayout>
  );
}
