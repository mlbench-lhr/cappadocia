"use client";

import GenericDataTable, { Column } from "../GenericDataTable";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from 'react-toastify';
// import { useAuth } from "@/admin/context/AuthContext";
import { useParams, useSearchParams } from "next/navigation";
import ActionButton from "../ActionButton";

export type TourData = {
    id: string;
    tourTitle: string;
    vendor: string;
    price: number;
    capacity: number
};

export const dummyTours: TourData[] = [
    {
        id: "1",
        tourTitle: "Hot Air Balloon Experience",
        vendor: "Cappadocia Travel Co.",
        price: 120,
        capacity: 12,
    },
    {
        id: "2",
        tourTitle: "Sunset Jeep Safari",
        vendor: "Skyline Tours",
        price: 80,
        capacity: 8,
    },
    {
        id: "3",
        tourTitle: "Underground City Tour",
        vendor: "Anatolia Adventures",
        price: 95,
        capacity: 20,
    },
    {
        id: "4",
        tourTitle: "Blue Lagoon Boat Trip",
        vendor: "Blue Horizon Travels",
        price: 150,
        capacity: 25,
    },
    {
        id: "5",
        tourTitle: "Istanbul Old City Walking Tour",
        vendor: "Historic Gateways",
        price: 60,
        capacity: 15,
    },
];



export default function AllTours() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [tableData, setTableData] = useState<TourData[]>([]);
    const [totaluser, setTotaluser] = useState(5);
    const currentPage = parseInt(searchParams.get("user_page") || "1", 10);
    const [loading, setLoading] = useState(false)
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
            console.log("search")
            const params = new URLSearchParams(searchParams.toString());
            params.set("user_page", "1");
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [search]);

    const columns: Column<TourData>[] = [
        {
            header: "Tour Title",
            accessor: "tourTitle",
            cell: (row) => (
                <div className="opacity-60">{row.tourTitle}</div>
            ),
        },
        {
            header: "Vendor",
            accessor: "vendor",
            cell: (row) => (
                <div className="opacity-60">
                    {row.vendor}
                </div>
            ),
        },
        {
            header: "Price",
            accessor: "price",
            cell: (row) => (
                <div className="opacity-60">€{row.price}</div>
            ),
        },
        {
            header: "Capacity",
            accessor: "capacity",
            cell: (row) => (
                <div className="opacity-60">{row.capacity} people</div>
            ),
        },
        {
            header: "Action",
            accessor: "action",
            cell: (row) => (
                <ActionButton
                    link={`/admin/tours-activities/details/${row.id}?tour_page=${currentPage}`}
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

    const handleAddUser = (newUserData: TourData) => {
        // Optimistically add to the beginning of the list
        setTableData(prev => [newUserData, ...prev]);
        setTotaluser(prev => prev + 1);

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
                title="Tours & Actvities"
                data={dummyTours}
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
                    "Tours & Actvities": "/images/admin/users/no_user.svg",
                }}
                size={`Total Tours & Actvities: 4`}
            />
        </div>
    );


}
