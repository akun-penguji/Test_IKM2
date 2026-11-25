import DialogAddService from "@/Components/DialogAddService";
import DialogEditQuestion from "@/Components/DialogEditQuestion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Add, Edit } from "@mui/icons-material";
import {
    Box,
    Container,
    FormControlLabel,
    FormGroup,
    Switch,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { DataTable } from "@/Components/ui/DataTable";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from "@/Components/ui/breadcrumb";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Download, Loader2, Upload } from "lucide-react";

export default function QuizResponse({ auth, data }) {
    const [selectedId, setSelectedId] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [fileError, setFileError] = useState("");
    const [fileInputKey, setFileInputKey] = useState(0);
    const { flash } = usePage().props;

    const handleImportFile = (event) => {
        const selectedFile = event.target.files?.[0] ?? null;
        setFileError("");

        if (!selectedFile) {
            setImportFile(null);
            return;
        }

        const extension = selectedFile.name.split(".").pop()?.toLowerCase();
        if (!['xlsx', 'xls'].includes(extension)) {
            setImportFile(null);
            setFileError("File harus berformat XLSX atau XLS.");
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setImportFile(null);
            setFileError("Ukuran file maksimal 10 MB.");
            return;
        }

        setImportFile(selectedFile);
    };

    const handleImport = (event) => {
        event.preventDefault();
        if (!importFile) {
            setFileError("Pilih file Excel yang akan diimpor.");
            return;
        }

        setImporting(true);
        router.post(
            route("survey.import.store"),
            { file: importFile },
            {
                forceFormData: true,
                errorBag: "import",
                preserveScroll: true,
                onError: (errors) => {
                    if (errors.file) setFileError(errors.file);
                },
                onSuccess: () => {
                    setImportFile(null);
                    setFileInputKey((value) => value + 1);
                },
                onFinish: () => setImporting(false),
            },
        );
    };

    const columns = [
        {
            accessorKey: "created_at",
            header: "Tanggal Diisi",
            cell: ({ row }) =>
                moment(row.getValue("created_at")).format("DD-MM-YYYY"),
            enableSorting: true,
        },
        {
            accessorKey: "gender",
            header: "Jenis Kelamin",
            enableSorting: true,
        },
        {
            accessorKey: "education",
            header: "Pendidikan",
            enableSorting: true,
        },
        {
            accessorKey: "job",
            header: "Pekerjaan",
            enableSorting: true,
        },
        {
            accessorKey: "q1",
            header: "Bobot u1",
            enableSorting: true,
        },
        {
            accessorKey: "q2",
            header: "Bobot u2",
            enableSorting: true,
        },
        {
            accessorKey: "q3",
            header: "Bobot u3",
            enableSorting: true,
        },
        {
            accessorKey: "q4",
            header: "Bobot u4",
            enableSorting: true,
        },
        {
            accessorKey: "q5",
            header: "Bobot u5",
            enableSorting: true,
        },
        {
            accessorKey: "q6",
            header: "Bobot u6",
            enableSorting: true,
        },
        {
            accessorKey: "q7",
            header: "Bobot u7",
            enableSorting: true,
        },
        {
            accessorKey: "q8",
            header: "Bobot u8",
            enableSorting: true,
        },
        {
            accessorKey: "q9",
            header: "Bobot u9",
            enableSorting: true,
        },
        {
            accessorKey: "suggestion",
            header: "Pesan dan saran",
            enableSorting: true,
        },
        {
            accessorKey: "service.name",
            header: "Layanan",
            enableSorting: true,
        },
        {
            accessorKey: "lokus.name",
            header: "Lokus",
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
        router.get("/survey/" + id);
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
            onClose();
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

    useEffect(() => {
        if (flash.importOpen || flash.importSummary) {
            setImportOpen(true);
        }
    }, [flash.importOpen, flash.importSummary]);

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
                                <BreadcrumbPage>Data Survey</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Data Survey" />
                <div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="container mx-auto pb-10">
                                <div className="flex flex-row flex-wrap gap-2 justify-end mb-4 mx-auto">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setImportOpen(true)}
                                    >
                                        Import SKM
                                        <Upload className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Link href={route("survey.guest.index")}>
                                        <Button>
                                            Tambah Data Survey
                                            <Add />
                                        </Button>
                                    </Link>
                                </div>
                                <DataTable columns={columns} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Import Data SKM</DialogTitle>
                        <DialogDescription>
                            Gunakan template resmi. Seluruh file akan ditolak jika ada satu baris yang tidak valid.
                        </DialogDescription>
                    </DialogHeader>

                    {flash.importSummary && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                            {flash.importSummary.inserted} data berhasil disimpan dan {" "}
                            {flash.importSummary.skipped} duplikat dilewati.
                        </div>
                    )}

                    <form onSubmit={handleImport} className="space-y-4">
                        <a
                            href={route("survey.import.template")}
                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Unduh template import
                        </a>

                        <div className="space-y-2">
                            <label htmlFor="skm-import-file" className="text-sm font-medium">
                                File Excel
                            </label>
                            <Input
                                key={fileInputKey}
                                id="skm-import-file"
                                type="file"
                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                onChange={handleImportFile}
                                disabled={importing}
                            />
                            <p className="text-xs text-muted-foreground">XLSX atau XLS, maksimal 10 MB.</p>
                            {fileError && <p className="text-sm text-red-600">{fileError}</p>}
                        </div>

                        {flash.importErrors?.length > 0 && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-3">
                                <p className="mb-2 text-sm font-semibold text-red-800">
                                    Perbaiki kesalahan berikut lalu unggah kembali:
                                </p>
                                <ul className="max-h-52 list-disc space-y-1 overflow-y-auto pl-5 text-sm text-red-700">
                                    {flash.importErrors.map((error, index) => (
                                        <li key={`${error.row}-${error.column}-${index}`}>
                                            Baris {error.row}, {error.column}: {error.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setImportOpen(false)} disabled={importing}>
                                Tutup
                            </Button>
                            <Button type="submit" disabled={importing || !importFile}>
                                {importing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Mengimpor...
                                    </>
                                ) : (
                                    "Import Data"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
