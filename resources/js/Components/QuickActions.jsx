import { IconIsiSurvey, IconLaporanIkm } from "@/Components/ui/icons";
import { router } from "@inertiajs/react";

export default function QuickActions() {
    const surveyUrl = "/isi-survey";
    const galleryUrl = "/laporan-survey";

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
                <button
                    onClick={() => router.visit(surveyUrl)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-blue-500 bg-blue-50 transition-colors cursor-pointer"
                >
                    <IconIsiSurvey className="w-12 h-12" />
                    <div className="text-left">
                        <span className="font-semibold text-gray-900 block">Isi Survey</span>
                        <span className="text-sm text-gray-600">Berikan penilaian</span>
                    </div>
                </button>
                <button
                    onClick={() => router.visit(galleryUrl)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-purple-500 bg-purple-50 transition-colors cursor-pointer"
                >
                    <IconLaporanIkm className="w-12 h-12" />
                    <div className="text-left">
                        <span className="font-semibold text-gray-900 block">Laporan IKM</span>
                        <span className="text-sm text-gray-600">Lihat rekap data</span>
                    </div>
                </button>
            </div>
        </div>
    );
}