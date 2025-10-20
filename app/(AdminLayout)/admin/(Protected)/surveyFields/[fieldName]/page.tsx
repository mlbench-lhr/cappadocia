"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilLine, Search, Trash2, Plus, ChevronLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import { Column, DynamicTable } from "../../../Components/Table/page";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export const fieldNames: Record<string, string> = {
  gradeLevel: "Grade Level",
  annualIncome: "Annual Income",
  activityType: "Activity Type",
  dreamSchool: "Dream School",
  race: "Race",
  recognitionLevel: "Recognition Level",
};

export default function FieldEntriesPage() {
  const { fieldName }: { fieldName: string } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [entryValue, setEntryValue] = useState("");

  // -------------------- Fetch Entries --------------------
  const getFieldEntries = async () => {
    try {
      if (isFirstLoad) {
        setLoading(true);
      }
      const res = await axios.get(
        `/api/profile-fields/entries?field=${fieldName}&search=${search}&offset=${offset}&limit=${limit}`
      );
      setEntries(res.data.items);
      setTotal(res.data.total);
    } catch (error) {
      Swal.fire("Error", "Failed to load field entries.", "error");
    } finally {
      if (isFirstLoad) {
        setLoading(false);
        setIsFirstLoad(false);
      }
    }
  };

  useEffect(() => {
    getFieldEntries();
  }, [offset, search]);

  // -------------------- Add Entry --------------------
  const addFieldEntry = async () => {
    if (!entryValue.trim())
      return Swal.fire("Error", "Value required", "error");
    try {
      await axios.put("/api/profile-fields/singleField", {
        field: fieldName,
        value: entryValue,
      });
      Swal.fire("Success", "Entry added!", "success");
      setOpenDialog(false);
      getFieldEntries();
    } catch {
      Swal.fire("Error", "Failed to add entry", "error");
    }
  };

  // -------------------- Edit Entry --------------------
  const editFieldEntry = async () => {
    if (!entryValue.trim())
      return Swal.fire("Error", "Value required", "error");
    try {
      await axios.patch("/api/profile-fields/singleField", {
        id: currentEntry?._id,
        value: entryValue,
      });
      Swal.fire("Success", "Entry updated!", "success");
      setOpenDialog(false);
      getFieldEntries();
    } catch {
      Swal.fire("Error", "Failed to update entry", "error");
    }
  };

  // -------------------- Delete Entry --------------------
  const deleteFieldEntry = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Delete?",
      text: "This will remove the entry permanently.",
      icon: "warning",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) return;
    try {
      await axios.delete(`/api/profile-fields/singleField?id=${id}`);
      Swal.fire("Deleted!", "Entry removed.", "success");
      getFieldEntries();
    } catch {
      Swal.fire("Error", "Failed to delete entry.", "error");
    }
  };

  // -------------------- Table Columns --------------------
  const columns: Column[] = [
    {
      header: "S.No.",
      accessor: "srNo",
    },
    {
      header: `${fieldNames[fieldName]} Name`,
      accessor: "name",
    },
    {
      header: "Added on",
      accessor: "createdAt",
      render: (item) => (
        <span>{moment(item.createdAt).format("MMM DD, YYYY")}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (item) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="destructive"
            onClick={() => deleteFieldEntry(item._id)}
            className="w-fit h-fit p-[5px] rounded-[4px]"
          >
            <Trash2 size={12} />
          </Button>
          <Button
            size="icon"
            className="w-fit h-fit bg-[#B32053] p-[5px] rounded-[4px]"
            onClick={() => {
              setEditMode(true);
              setCurrentEntry(item);
              setEntryValue(item.name);
              setOpenDialog(true);
            }}
          >
            <PencilLine size={12} />
          </Button>
        </div>
      ),
    },
  ];

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
  // -------------------- Render --------------------
  return (
    <AdminLayout>
      <div className="min-h-screen w-full">
        <div className="w-full mb-8 flex justify-between items-center flex-wrap gap-y-2">
          <div className="w-full md:w-fit space-y-[5px]">
            <div className="flex justify-start gap-[24px] items-center">
              <Link href={"/admin/surveyFields"} className="pl-2">
                <ChevronLeft />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                All {fieldNames[fieldName]}
              </h1>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="col-span-2 relative w-full md:w-[325px] h-[50px]">
              <Search className="absolute left-3 top-[50%] translate-y-[-50%] h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full md:w-[325px] h-[50px] rounded-[10px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setEditMode(false);
                setEntryValue("");
                setOpenDialog(true);
              }}
              variant={"green_secondary_button"}
            >
              <Plus size={16} className="mr-2" /> Add Entry
            </Button>
          </div>
        </div>

        <DynamicTable
          data={entries}
          columns={columns}
          itemsPerPage={limit}
          isLoading={loading}
          serverPagination={{
            currentPage: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(total / limit),
            onPageChange: (page) => setOffset((page - 1) * limit),
          }}
          type="Field"
        />

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Entry" : "Add New Entry"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-3">
              <Label>Entry Name</Label>
              <Input
                value={entryValue}
                onChange={(e) => setEntryValue(e.target.value)}
                placeholder="Enter value..."
              />
            </div>

            <DialogFooter className="mt-5">
              <Button
                onClick={editMode ? editFieldEntry : addFieldEntry}
                disabled={!entryValue.trim()}
              >
                {editMode ? "Save Changes" : "Add Entry"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
