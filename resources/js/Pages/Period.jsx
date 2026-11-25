import DialogEditPeriod from "@/Components/DialogEditPeriod";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Delete, Edit, HelpOutline, Add } from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Tooltip,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Calendar1 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { DataTable } from "@/Components/ui/DataTable";
import { Badge } from "@/Components/ui/badge";

const periodSchema = z.object({
    start_at: z.date({
        required_error: "Anda belum mengisi tanggal mulai",
    }),
    end_at: z.date({
        required_error: "Anda belum mengisi tanggal akhir",
    }),
    name: z
        .string({
            required_error: "Anda belum mengisi nama periode",
        })
        .min(1, "Anda belum mengisi nama periode"),
});

export default function Period({ auth, data, periodList }) {
    const { flash } = usePage().props;
    const [selectedId, setSelectedId] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState(0);
    const [open, setOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const form = useForm({
        resolver: zodResolver(periodSchema),
        defaultValues: {
            start_at: moment().startOf("M").toDate(),
            end_at: moment().endOf("M").toDate(),
            name: "",
        },
    });

    function onSubmit(values) {
        router.post("/periods", {
            start_at: moment(values.start_at).format("YYYY-MM-DD"),
            end_at: moment(values.end_at).format("YYYY-MM-DD"),
            name: values.name,
        });
    }

    // Define columns for DataTable component
    const columns = [
        {
            accessorKey: "name",
            header: "Nama Periode",
            enableSorting: true,
        },
        {
            accessorKey: "year",
            header: "Tahun",
            enableSorting: true,
            cell: ({ row }) => {
                return moment(row.original.start_at).format("YYYY");
            },
        },
        {
            accessorKey: "start_at",
            header: "Tanggal Mulai",
            enableSorting: true,
            cell: ({ row }) => {
                return moment(row.original.start_at).format("DD MMM YYYY");
            },
        },
        {
            accessorKey: "end_at",
            header: "Tanggal Akhir",
            enableSorting: true,
            cell: ({ row }) => {
                return moment(row.original.end_at).format("DD MMM YYYY");
            },
        },
        {
            accessorKey: "is_active",
            header: "Status Aktif",
            enableSorting: true,
            cell: ({ row }) => {
                return row.original.is_active ? (
                    <Badge className="bg-green-500 hover:bg-green-400">
                        Aktif
                    </Badge>
                ) : (
                    <Badge className="bg-red-500 hover:bg-red-400">
                        Tidak Aktif
                    </Badge>
                );
            },
        },
        {
            accessorKey: "is_published",
            header: "Status Publish",
            enableSorting: true,
            cell: ({ row }) => {
                return row.original.is_published ? (
                    <Badge className="bg-green-500 hover:bg-green-400">
                        Publish
                    </Badge>
                ) : (
                    <Badge className="bg-red-500 hover:bg-red-400">
                        Tidak Publish
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item.id, item)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                        >
                            <Delete className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const publishPeriod = () => {
        router.patch("/periods/" + data.id, {
            is_published: 1,
        });
    };

    const handleEdit = (id, row) => {
        setSelectedId(id);
        setSelectedData(row);
        setOpen(true);
    };

    const handleDelete = (id) => {
        setDeleteDialog(true);
        setSelectedDeleteId(id);
    };

    const onDelete = () => {
        router.delete("/periods/" + selectedDeleteId);
        setDeleteDialog(false);
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
                                <BreadcrumbLink>Perhitungan IKM</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Perhitungan Periode
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Penentuan Periode" />
                <div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 h-full">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-full py-5">
                            <div className="flex flex-col p-3 text-start border-secondary">
                                <span className="text-lg font-bold border border-primary w-max p-2 px-4 rounded-md mb-5">
                                    Periode Aktif :{" "}
                                    {data
                                        ? moment(data.start_at).format(
                                              "DD MMM YYYY",
                                          ) +
                                          " s/d " +
                                          moment(data.end_at).format(
                                              "DD MMM YYYY",
                                          )
                                        : "-"}
                                </span>

                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="flex flex-col gap-5 items-start mb-5"
                                    >
                                        <div className="flex flex-col w-1/4 relative">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Tooltip
                                                            title="Penamaan dapat diawali dengan: Bulan, Triwulan, Tahun"
                                                            placement="top-start"
                                                            sx={{
                                                                position:
                                                                    "absolute",
                                                                right: 0,
                                                                top: 5,
                                                                width: 15,
                                                                height: 15,
                                                            }}
                                                        >
                                                            <HelpOutline />
                                                        </Tooltip>
                                                        <FormLabel>
                                                            Nama Periode
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Masukkan nama periode"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-red-500" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-center gap-5">
                                            <FormField
                                                control={form.control}
                                                name="start_at"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tanggal Mulai
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant={
                                                                            "outline"
                                                                        }
                                                                        className={cn(
                                                                            "w-[240px] pl-3 text-left font-normal",
                                                                            !field.value &&
                                                                                "text-muted-foreground",
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(
                                                                                field.value,
                                                                                "PPP",
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pilih
                                                                                Tanggal
                                                                            </span>
                                                                        )}
                                                                        <Calendar1 className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage className="text-red-500" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="end_at"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tanggal Akhir
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant={
                                                                            "outline"
                                                                        }
                                                                        className={cn(
                                                                            "w-[240px] pl-3 text-left font-normal",
                                                                            !field.value &&
                                                                                "text-muted-foreground",
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(
                                                                                field.value,
                                                                                "PPP",
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pilih
                                                                                Tanggal
                                                                            </span>
                                                                        )}
                                                                        <Calendar1 className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage className="text-red-500" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                Set Periode
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={publishPeriod}
                                                className="bg-primary hover:bg-primary/90"
                                                disabled={!data}
                                            >
                                                Publish Periode
                                            </Button>
                                        </div>
                                    </form>
                                </Form>

                                <div className="container mx-auto pb-10">
                                    <DataTable
                                        columns={columns}
                                        data={periodList}
                                        searchKey="name"
                                    />
                                </div>
                                <DialogEditPeriod
                                    id={selectedId}
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    data={selectedData}
                                />
                                <Dialog
                                    onClose={() => setDeleteDialog(false)}
                                    open={deleteDialog}
                                    fullWidth
                                >
                                    <DialogTitle>Hapus Periode</DialogTitle>
                                    <DialogContent>
                                        Apakah anda yakin untuk menghapus
                                        periode ini?
                                        <Stack
                                            direction="row"
                                            justifyContent={"end"}
                                            marginTop={2}
                                            gap={2}
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    setDeleteDialog(false)
                                                }
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                variant="contained"
                                                endIcon={<Delete />}
                                                onClick={() => onDelete()}
                                                color="error"
                                            >
                                                Hapus
                                            </Button>
                                        </Stack>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
