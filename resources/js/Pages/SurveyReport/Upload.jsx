import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Input } from "@/Components/ui/input";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { CloudUpload } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SurveyReportUpload({ auth }) {
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !file) {
            toast("Mohon isi semua data", {
                type: "warning",
                position: "bottom-center",
            });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);

        router.post("/survey-reports", formData, {
            onFinish: () => setLoading(false),
            onSuccess: () => {
                setName("");
                setFile(null);
            },
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== "application/pdf") {
            toast("Hanya file PDF yang diperbolehkan", {
                type: "warning",
                position: "bottom-center",
            });
            return;
        }
        setFile(selectedFile);
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
                                <BreadcrumbLink>Upload Laporan Survey</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Upload Laporan Survey" />
                <div className="max-w-2xl mx-auto mt-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-6">
                            Upload Laporan Survey
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nama Laporan
                                </label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Laporan IKM 2024"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    File PDF
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50">
                                    <input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <CloudUpload className="h-12 w-12 text-gray-400 mb-2" />
                                        {file ? (
                                            <span className="text-sm text-gray-600">
                                                {file.name}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                Klik untuk upload PDF (max 10MB)
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Mengupload..." : "Upload Laporan"}
                            </Button>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}