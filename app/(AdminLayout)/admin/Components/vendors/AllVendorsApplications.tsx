"use client";

import GenericDataTable, { Column } from "../GenericDataTable";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from 'react-toastify';
// import { useAuth } from "@/admin/context/AuthContext";
import { useParams, useSearchParams } from "next/navigation";
import ActionButton from "../ActionButton";

export type UserData = {
    id: string;
    username: string;
    email: string;
    createdAt?: string;
    downloads?: number;
    profile_image_url: string
    avatar?: string
};

const dummyUsers = [
  {
    id: "1",
    username: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    profile_image_url: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "2",
    username: "Ali Raza",
    email: "ali.raza@example.com",
    profile_image_url: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "3",
    username: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    profile_image_url: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: "4",
    username: "Usman Tariq",
    email: "usman.tariq@example.com",
    profile_image_url: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    id: "5",
    username: "Fatima Noor",
    email: "fatima.noor@example.com",
    profile_image_url: "https://randomuser.me/api/portraits/women/28.jpg",
  },
];

export default function AllVendorApplications() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [tableData, setTableData] = useState<UserData[]>([]);
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

    const columns: Column<UserData>[] = [
        {
            header: "User Name",
            accessor: "username",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-10 h-10">
                        <Image
                            src={row.avatar || "/images/avatar.png"}
                            alt={row.username}
                            width={32}
                            height={32}
                            className="rounded-full h-full w-full object-cover"
                        />
                    </div>
                    <span className="font-medium">{row.username}</span>
                </div>
            ),
        },
        {
            header: "Email Address",
            accessor: "email",
            cell: (row) => (
                <div className="text-[var(--secondary)]">{row.email}</div>
            ),
        },
        {
            header: "Added on",
            accessor: "createdAt",
            cell: (row) => (
                <div className="text-[var(--secondary)]">{row.createdAt?.slice(0, 10)}</div>
            ),
        },
        {
            header: "Downloads",
            accessor: "downloads",
            cell: (row) => (
                <div className="text-[var(--secondary)]">{row.downloads}</div>
            ),
        },
        {
            header: "Action",
            accessor: "action",
            cell: (row) => (
                <ActionButton
                    link={`/admin/users/detailUser/${row.id}?user_page=${currentPage}`}
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

    const handleAddUser = (newUserData: UserData) => {
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
                title="All Users"
                data={dummyUsers}
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
                    "All Users": "/images/admin/users/no_user.svg",
                }}
            />
        </div>
    );


}
