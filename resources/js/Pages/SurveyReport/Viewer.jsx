import { Head } from "@inertiajs/react";
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Download } from "@mui/icons-material";
import ConditionalLayout from "@/Layouts/ConditionalLayout";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function Viewer({ report }) {
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fileUrl = `/storage/${report.file_path}`;

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(error) {
        console.error("PDF load error:", error);
        setError("Gagal memuat PDF");
        setLoading(false);
    }

    return (
        <ConditionalLayout>
            <Head title={report.name} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{report.name}</h1>
                    <a
                        href={fileUrl}
                        download={report.name}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Download />
                        Unduh PDF
                    </a>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="text-gray-500">Memuat PDF...</div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center py-12">
                            <div className="text-red-500">{error}</div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={null}
                        >
                            {numPages &&
                                Array.from(new Array(numPages), (el, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        maxWidth={800}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        className="mb-4 shadow-lg"
                                    />
                                ))}
                        </Document>
                    </div>
                </div>
            </div>
        </ConditionalLayout>
    );
}

