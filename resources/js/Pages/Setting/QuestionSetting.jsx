import DialogEditQuestion from "@/Components/DialogEditQuestion";
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
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function QuestionSetting({ auth, data }) {
    const [selectedId, setSelectedId] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const [open, setOpen] = useState(false);
    const { flash } = usePage().props;

    const columns = [
        {
            accessorKey: "seq",
            header: "Nomor",
            enableSorting: true,
        },
        {
            accessorKey: "name",
            header: "Pertanyaan",
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
                                <BreadcrumbPage>List Pertanyaan</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="List Pertanyaan" />
                <div>
                    <div className="w-full mx-auto">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="container mx-auto pb-10">
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    searchKey="name"
                                />
                            </div>
                            <DialogEditQuestion
                                id={selectedId}
                                open={open}
                                onClose={() => setOpen(false)}
                                data={selectedData}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
