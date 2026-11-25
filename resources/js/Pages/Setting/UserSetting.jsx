import DialogAddUser from "@/Components/DialogAddUser";
import DialogEditQuestion from "@/Components/DialogEditQuestion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from "@/Components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";
import { DataTable } from "@/Components/ui/DataTable";

export default function QuestionSetting({ auth, userList }) {
    const [selectedId, setSelectedId] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { flash } = usePage().props;

    const columns = [
        {
            accessorKey: "name",
            header: "Nama",
            enableSorting: true,
        },
        {
            accessorKey: "username",
            header: "Username",
            enableSorting: true,
        },
        {
            accessorKey: "role.name",
            header: "Role",
            enableSorting: true,
        },
        {
            accessorKey: "service.name",
            header: "Layanan",
            cell: ({ row }) => {
                return row.original.service?.name || "Semua layanan";
            },
            enableSorting: true,
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item.id, item)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                );
            },
        },
    ];

    const handleEdit = (id, row) => {
        setIsEdit(true);
        setSelectedId(id);
        setSelectedData(row);
        setOpen(true);
    };

    const handleAdd = () => {
        setIsEdit(false);
        setOpen(true);
    };

    useEffect(() => {
        if (flash.message) {
            toast(flash.message, {
                type: flash.type,
                position: "bottom-center",
            });
        }
    }, [flash]);

    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Pengaturan</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Pengguna</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Pengaturan Pengguna" />
                <div>
                    <div className="w-full mx-auto">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="container mx-auto pb-10">
                                <div className="flex flex-row justify-end mb-4 mx-auto">
                                    <Button onClick={handleAdd}>
                                        Tambah Pengguna
                                        <Add />
                                    </Button>
                                </div>
                                <DataTable
                                    columns={columns}
                                    data={userList}
                                    searchKey="name"
                                />
                            </div>
                            <DialogAddUser
                                id={selectedId}
                                data={selectedData}
                                isEdit={isEdit}
                                onClose={() => setOpen(false)}
                                open={open}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
