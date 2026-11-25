import { router } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

export default function QuestionnaireCard() {
    const surveyUrl = "/isi-survey";

    return (
        <div className="relative bg-[#0455ec] rounded-xl shadow-md p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                <svg viewBox="0 0 100 100" fill="white">
                    <circle cx="80" cy="20" r="40" />
                    <circle cx="90" cy="80" r="25" />
                    <circle cx="30" cy="90" r="20" />
                </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                <svg viewBox="0 0 100 100" fill="white">
                    <circle cx="30" cy="50" r="35" />
                    <circle cx="80" cy="30" r="20" />
                </svg>
            </div>
            <div className="absolute top-4 left-4 w-8 h-8 opacity-20">
                <svg viewBox="0 0 100 100" fill="white">
                    <polygon points="50,10 90,90 10,90" />
                </svg>
            </div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Suara Anda Sangat Berarti!
                        </h3>
                        <p className="text-sm text-blue-100 mt-4">
                            Bantu kami meningkatkan kualitas pelayanan publik di
                            Kabupaten Bekasi.
                        </p>
                    </div>
                    <img
                        src="/images/questionnaire.png"
                        alt="Questionnaire"
                        className="w-auto h-44 object-contain"
                    />
                </div>
                <button
                    onClick={() => router.visit(surveyUrl)}
                    className="w-full py-3 px-4 bg-white text-[#0455ec] font-semibold rounded-lg hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>Mulai Isi Survey</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
