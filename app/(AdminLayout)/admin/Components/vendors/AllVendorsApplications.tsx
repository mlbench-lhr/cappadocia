"use client";

import GenericDataTable, { Column } from "../GenericDataTable";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from 'react-toastify';
// import { useAuth } from "@/admin/context/AuthContext";
import { useParams, useSearchParams } from "next/navigation";
import ActionButton from "../ActionButton";

export type VendorData = {
    id: string;
    buisnessName: string;
    email: string;
    dateApplied?: string;
    contact_person: string;
    tursab_number: number
};

export const dummyVendors: VendorData[] = [
    {
        id: "1",
        buisnessName: "Cappadocia Travel Co.",
        email: "info@cappadociatravel.com",
        dateApplied: "2025-10-01",
        contact_person: "Ali Demir",
        tursab_number: 45239,
    },
    {
        id: "2",
        buisnessName: "Skyline Tours",
        email: "contact@skylinetours.com",
        dateApplied: "2025-09-15",
        contact_person: "Mehmet Yildiz",
        tursab_number: 38921,
    },
    {
        id: "3",
        buisnessName: "Anatolia Adventures",
        email: "support@anatoliaadventures.com",
        dateApplied: "2025-08-27",
        contact_person: "Fatma Kaya",
        tursab_number: 51784,
    },
    {
        id: "4",
        buisnessName: "Blue Horizon Travels",
        email: "info@bluehorizon.com",
        dateApplied: "2025-07-10",
        contact_person: "Hasan Aksoy",
        tursab_number: 40312,
    },
];


export default function AllVendorApplications() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [tableData, setTableData] = useState<VendorData[]>([]);
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

    const columns: Column<VendorData>[] = [
        {
            header: "Buisness Name",
            accessor: "buisnessName",
            cell: (row) => (
                <div className="opacity-60">{row.buisnessName}</div>
            ),
        },
        {
            header: "Date Applied",
            accessor: "dateApplied",
            cell: (row) => (
                <div className="opacity-60">
                    {row.dateApplied ? row.dateApplied.slice(0, 10) : "—"}
                </div>
            ),
        },
        {
            header: "Contact Person",
            accessor: "contact_person",
            cell: (row) => (
                <div className="opacity-60">{row.contact_person}</div>
            ),
        },
        {
            header: "Email Address",
            accessor: "email",
            cell: (row) => (
                <div className="opacity-60">{row.email}</div>
            ),
        },
        {
            header: "TURSAB Number",
            accessor: "tursab_number",
            cell: (row) => (
                <div className="opacity-60">{row.tursab_number}</div>
            ),
        },
        {
            header: "Action",
            accessor: "action",
            cell: (row) => (
                <ActionButton
                    link={`/admin/vendor-applications/details/${row.id}?vendor_page=${currentPage}`}
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

    const handleAddUser = (newUserData: VendorData) => {
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
                title="Vendor Applications"
                data={dummyVendors}
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
                    "Vendor Applications": "/images/admin/users/no_user.svg",
                }}
                size={`Total Application: 4`}
            />
        </div>
    );


}
