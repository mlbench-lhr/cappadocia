"use client";
export const dynamic = "force-dynamic";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Column,
  DynamicTable,
} from "@/app/(AdminLayout)/admin/Components/Table/page";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type StatusFilter = "all" | "not_started" | "in_progress" | "done" | "skipped";

export default function UserDetail() {
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [milestones, setMilestones] = useState<{
    milestones: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    milestones: [],
    total: 0,
    page: 1,
    limit: 7,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { id } = useParams();
  const router = useRouter();

  // Fetch user details (once)
  useEffect(() => {
    async function getUserDetails() {
      try {
        setUserLoading(true);
        const response = await axios.get(`/api/admin/users/detail/${id}`);
        setUser(response.data.user);
      } catch (error) {
        console.log("error----", error);
      } finally {
        setUserLoading(false);
      }
    }
    if (id) {
      getUserDetails();
    }
  }, [id]);

  // Fetch milestones (when page or filter changes)
  useEffect(() => {
    async function getMilestones() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "7",
          ...(statusFilter !== "all" && { status: statusFilter }),
        });

        const response = await axios.get(
          `/api/admin/users/detail/${id}/milestones?${params.toString()}`
        );
        setMilestones(response.data);
      } catch (error) {
        console.log("error----", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      getMilestones();
    }
  }, [id, currentPage, statusFilter]);

  // Handle status filter change
  const handleFilterChange = (status: StatusFilter) => {
    setStatusFilter((s) => {
      return s === status ? "all" : status;
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };
  console.log("status filter", statusFilter);

  const columns: Column[] = [
    {
      header: "ID",
      accessor: "id",
      nameAccessor: "id",
      subtitleAccessor: "id",
      render: (item) => <span>#{item._id.replace(/\D/g, "").slice(-5)}</span>,
    },
    {
      header: "Milestones Title",
      accessor: "title",
    },
    {
      header: "Added On",
      accessor: "createdAt",
      render: (item) => (
        <span>{moment(item.createdAt).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      header: "Due Date",
      accessor: "deadLine",
      render: (item) => (
        <span>{moment(item.deadLine).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (item) => (
        <span className={`capitalize ${item.status}`}>
          {item.status
            ?.replace("not_started", "Not Started")
            ?.replace("in_progress", "In Progress")}
        </span>
      ),
    },
  ];

  function deleteUser() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B32053",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/admin/users/deleteUser/${id}`);
          router.push("/admin/users");
        } catch (error) {
          console.log("error------", error);
        }
      }
    });
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full">
        <div className="w-full mx-auto">
          <div className="w-full mb-4 flex justify-between items-center">
            <div className="w-full mb-4 spacey-[15px]">
              <div className="flex justify-start gap-[12px] items-center mb-[16px]">
                <Link href={"/admin/users"} className="pl-2">
                  <ChevronLeft />
                </Link>
                <h1
                  className="text-xl md:text-2xl font-semibold text-gray-900"
                  style={{ textAlign: "start" }}
                >
                  Details
                </h1>
              </div>
              {userLoading ? (
                <div className="w-full bg-[#F8FAF6] flex justify-center items-center p-[17px] rounded-[30px] h-[200px]">
                  <p>Loading user details...</p>
                </div>
              ) : (
                <div className="w-full bg-[#F8FAF6] flex justify-center sm:justify-between p-[17px] rounded-[30px] items-start relative flex-wrap md:flex-nowrap gap-y-2">
                  <div className="w-full flex justify-center md:justify-start items-center gap-[20px] flex-wrap md:flex-nowrap">
                    <Image
                      width={196}
                      height={175}
                      alt=""
                      src={
                        user?.avatar ||
                        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      }
                      className="h-[175px] w-[196px] rounded-[32px] mx-auto"
                    />
                    <div className="w-full bg-[#F8FAF6] flex justify-between items-center md:items-start flex-col">
                      <h1 className="text-2xl md:text-[32px] font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      <h1 className="text-lg md:text-[18px] font-semibold text-[#51606E]">
                        {user?.email}
                      </h1>
                      <h1 className="text-sm md:text-[18px] font-semibold text-[#51606E] mt-[4px]">
                        Added On:{" "}
                        {moment(user?.createdAt).format("MMM DD, YYYY")}
                      </h1>
                    </div>
                  </div>
                  <Button
                    variant={"main_green_button"}
                    className="mx-auto sm:absolute top-[17px] right-[17px]"
                    onClick={deleteUser}
                  >
                    Delete User
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="w-full mb-4 flex justify-between items-center">
            <div className="w-fit space-y-[20px]">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Milestones {milestones.total > 0 && `(${milestones.total})`}
              </h1>
              <div className="flex justify-start items-center gap-4 flex-wrap">
                <button
                  onClick={() => handleFilterChange("not_started")}
                  className={`text-xs md:text-lg capitalize px-3 py-1 rounded-md transition-colors not_started ${
                    statusFilter === "not_started" ? "font-bold underline" : ""
                  }`}
                >
                  Not Started
                </button>
                <button
                  onClick={() => handleFilterChange("in_progress")}
                  className={`text-xs md:text-lg capitalize px-3 py-1 rounded-md transition-colors in_progress ${
                    statusFilter === "in_progress" ? "font-bold underline" : ""
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleFilterChange("done")}
                  className={`text-xs md:text-lg capitalize px-3 py-1 rounded-md transition-colors done ${
                    statusFilter === "done" ? "font-bold underline" : ""
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => handleFilterChange("skipped")}
                  className={`text-xs md:text-lg capitalize px-3 py-1 rounded-md transition-colors skipped ${
                    statusFilter === "skipped" ? "font-bold underline" : ""
                  }`}
                >
                  Skipped
                </button>
              </div>
            </div>
          </div>
          <DynamicTable
            data={milestones.milestones}
            columns={columns}
            itemsPerPage={7}
            onRowClick={(item) => console.log("Clicked:", item)}
            isLoading={loading}
            // Server-side pagination props
            serverPagination={{
              currentPage: currentPage,
              totalPages: milestones.totalPages,
              onPageChange: setCurrentPage,
            }}
            type="Milestones"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
