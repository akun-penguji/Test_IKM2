import { Head, router, usePage } from "@inertiajs/react";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { Delete } from "@mui/icons-material";
import ConditionalLayout from "@/Layouts/ConditionalLayout";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function Gallery({ reports }) {
    const { auth } = usePage().props;
    const [numPages, setNumPages] = useState({});
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
    const isAuthenticated = auth && auth.user;

    const handleClick = (id) => {
        router.get(`/survey-reports/${id}`);
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setDeleteDialog({ open: true, id });
    };

    const handleDeleteConfirm = () => {
        router.delete(`/survey-reports/${deleteDialog.id}`);
        setDeleteDialog({ open: false, id: null });
    };

    function onDocumentLoadSuccess({ numPages }, id) {
        setNumPages((prev) => ({ ...prev, [id]: numPages }));
    }

    return (
        <ConditionalLayout>
            <Head title="Laporan Survey" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Laporan Survey</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
                        >
                            <div
                                onClick={() => handleClick(report.id)}
                                className="cursor-pointer"
                            >
                                <div className="bg-gray-100 h-56 overflow-hidden flex items-center justify-center p-2">
                                    <Document
                                        file={`/storage/${report.file_path}`}
                                        onLoadSuccess={(pdf) =>
                                            onDocumentLoadSuccess(pdf, report.id)
                                        }
                                        loading={
                                            <div className="h-56 flex items-center justify-center text-gray-400">
                                                Memuat...
                                            </div>
                                        }
                                        onLoadError={(error) => {
                                            console.error("PDF load error:", error);
                                        }}
                                    >
                                        <Page
                                            pageNumber={1}
                                            width={180}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            scale={1}
                                        />
                                    </Document>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-sm truncate">
                                        {report.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(
                                            report.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {isAuthenticated && (
                                <button
                                    onClick={(e) => handleDeleteClick(e, report.id)}
                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Delete className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {reports.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Belum ada laporan survey</p>
                    </div>
                )}
            </div>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Laporan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConditionalLayout>
    );
}
