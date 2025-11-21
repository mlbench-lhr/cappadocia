"use client";

import GenericDataTable, { Column } from "../GenericDataTable";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
// import { useAuth } from "@/admin/context/AuthContext";
import { useParams, useSearchParams } from "next/navigation";
import ActionButton from "../ActionButton";

export type ReservationData = {
  id: string;
  tourTitle: string;
  partcipants: string; // e.g 2 Adults, 1 child
  status: string; //e.g Pending or Paid
  bookedBy: {
    name: string;
    email: string;
    profile_image: string;
  };
};

export const dummyReservations: ReservationData[] = [
  {
    id: "1",
    tourTitle: "Hot Air Balloon Experience",
    partcipants: "2 Adults, 1 Child",
    status: "Paid",
    bookedBy: {
      name: "Ali Demir",
      email: "ali.demir@example.com",
      profile_image: "/admin-images/user.svg",
    },
  },
  {
    id: "2",
    tourTitle: "Sunset Jeep Safari",
    partcipants: "3 Adults",
    status: "Pending",
    bookedBy: {
      name: "Mehmet Yildiz",
      email: "mehmet.yildiz@example.com",
      profile_image: "/admin-images/user.svg",
    },
  },
  {
    id: "3",
    tourTitle: "Underground City Tour",
    partcipants: "1 Adult, 2 Children",
    status: "Paid",
    bookedBy: {
      name: "Fatma Kaya",
      email: "fatma.kaya@example.com",
      profile_image: "/admin-images/user.svg",
    },
  },
  {
    id: "4",
    tourTitle: "Blue Lagoon Boat Trip",
    partcipants: "2 Adults",
    status: "Pending",
    bookedBy: {
      name: "Hasan Aksoy",
      email: "hasan.aksoy@example.com",
      profile_image: "/admin-images/user.svg",
    },
  },
  {
    id: "5",
    tourTitle: "Istanbul Old City Walking Tour",
    partcipants: "4 Adults",
    status: "Paid",
    bookedBy: {
      name: "Elif Aydin",
      email: "elif.aydin@example.com",
      profile_image: "/admin-images/user.svg",
    },
  },
];

export default function AllReservations() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tableData, setTableData] = useState<ReservationData[]>([]);
  const [totaluser, setTotaluser] = useState(5);
  const currentPage = parseInt(searchParams.get("user_page") || "1", 10);
  const [loading, setLoading] = useState(false);
  // const { user, token } = useAuth();
  const [search, setSearch] = useState("");
  const limit = 5;
  const pageTabs = useMemo(() => {
    const totalPages = Math.ceil(totaluser / limit);
    return Array.from({ length: totalPages }, (_, i) => (i + 1).toString());
  }, [totaluser, limit]);

  //   if (!sessionId) {
  //     redirect("/signin");
  //   }

  useEffect(() => {
    if (search) {
      console.log("search");
      const params = new URLSearchParams(searchParams.toString());
      params.set("user_page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [search]);

  const columns: Column<ReservationData>[] = [
    {
      header: "Booking ID",
      accessor: "id",
      cell: (row) => <div className="opacity-60">#{row.id}</div>,
    },
    {
      header: "Tour Title",
      accessor: "tourTitle",
      cell: (row) => <div className="opacity-60">{row.tourTitle}</div>,
    },
    {
      header: "Participants",
      accessor: "partcipants",
      cell: (row) => <div className="opacity-60">{row.partcipants}</div>,
    },
    {
      header: <div className="text-center w-20">Status</div>,
      accessor: "status",
      cell: (row) => (
        <div
          className={`font-medium rounded-full w-20 px-2 py-1 text-center ${
            row.status === "Paid"
              ? "text-green-600 bg-[#E7FAE3]"
              : "text-yellow-600 bg-[#FFE7CA]"
          }`}
        >
          {row.status}
        </div>
      ),
    },
    {
      header: "Booked By",
      accessor: "bookedBy",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.bookedBy.profile_image || "/images/avatar.png"}
            alt={row.bookedBy.name}
            width={32}
            height={32}
            className="rounded-full h-8 w-8 object-cover bg-gray-100"
          />
          <div>
            <div className="font-medium">{row.bookedBy.name}</div>
            <div className="text-sm opacity-60">{row.bookedBy.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      cell: (row) => (
        <ActionButton
          link={`/admin/reservations/details/${row.id}?reservation_page=${currentPage}`}
        />
      ),
    },
  ];

  // useEffect(() => {
  //     const timeout = setTimeout(() => {
  //         if (user?.email && token) {

  //             fetchData();
  //         }
  //     }, 1000); // slight delay to prevent double run

  //     return () => clearTimeout(timeout);
  // }, [user, currentPage, search]);
  // const fetchData = async () => {
  //     try {
  //         // ?search=john&page=1&limit=5
  //         setLoading(true)
  //         const response = await fetch(`/api/admin/user/get_users?search=${search}&page=${currentPage}&limit=${limit}`, {
  //             headers: {
  //                 Authorization: `Bearer ${token}`,
  //             },
  //         });

  //         const result = await response.json();

  //         if (!response.ok || result.data.status === false) {
  //             throw new Error(result.data?.message || result.error)
  //         }

  //         console.log(result);
  //         setTotaluser(result.total);
  //         setTableData(result.data);
  //     } catch (err: unknown) {
  //         const errorMessage = err instanceof Error ? err.message : String(err);
  //         toast.error(errorMessage);
  //         console.log("error", err);
  //         setTotaluser(0);
  //         setTableData([]);
  //     } finally {
  //         setLoading(false)
  //     }
  // };

  const handleAddUser = (newUserData: ReservationData) => {
    // Optimistically add to the beginning of the list
    setTableData((prev) => [newUserData, ...prev]);
    setTotaluser((prev) => prev + 1);

    // Optionally: if you're on a page other than 1, navigate to page 1
    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("user_page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="">
      <GenericDataTable
        title="Reservations"
        data={dummyReservations}
        tabs={pageTabs}
        columns={columns}
        pageSize={limit}
        currentPage={currentPage}
        loading={loading}
        setLoading={setLoading}
        querykey="user_page"
        search={search}
        setSearch={setSearch}
        onAddUser={handleAddUser}
        emptyStateImages={{
          Reservations: "/images/admin/users/no_user.svg",
        }}
        size={`Total Reservations: 4`}
      />
    </div>
  );
}
