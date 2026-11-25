import DialogAddService from "@/Components/DialogAddService";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";
import { DataTable } from "@/Components/ui/DataTable";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Add, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ServiceSetting({ auth, data }) {
    const [selectedId, setSelectedId] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const { flash } = usePage().props;

    const columns = [
        {
            accessorKey: "name",
            header: "Nama Layanan",
            enableSorting: true,
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex flex-col gap-2">
                        <Label>
                            {item.is_active ? "Aktif" : "Tidak Aktif"}
                        </Label>
                        <Switch
                            checked={item.is_active}
                            onCheckedChange={(e) => setActive(item.id, e)}
                        />
                    </div>
                );
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
        setSelectedId(id);
        setSelectedData(row);
        setIsEdit(true);
        setOpen(true);
    };

    const handleAdd = () => {
        setIsEdit(false);
        setOpen(true);
    };

    const setActive = (id, val) => {
        try {
            router.patch("/services/" + id, {
                is_active: val,
            });
        } catch (error) {
            console.error(error);
        }
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
                                <BreadcrumbPage>Data Layanan</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Pengaturan Layanan" />
                <div>
                    <div className="w-full mx-auto">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="container mx-auto pb-10">
                                <div className="flex flex-row justify-end mb-4 mx-auto">
                                    <Button onClick={handleAdd}>
                                        Tambah Layanan
                                        <Add />
                                    </Button>
                                </div>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    searchKey="name"
                                />
                            </div>
                            <DialogAddService
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
