import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import axios from "axios";
import ApexChart from "react-apexcharts";
import moment from "moment/moment";
import "moment/locale/id";
import { useState, useEffect } from "react";

export default function Hero2({ period }) {
    const [nilaiKonversi, setNilaiKonversi] = useState(0);
    const [akreditasiColor, setAkreditasiColor] = useState("");
    const [dataCount, setDataCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const radialOptions = {
        chart: { height: 200, type: "radialBar" },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: { margin: 0, size: "70%", background: "#fff" },
                track: { background: "#f2f2f2", strokeWidth: "67%", margin: 0 },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: "#888",
                        fontSize: "14px",
                    },
                    value: {
                        formatter: (val) => parseFloat(val).toFixed(2),
                        color: "#111",
                        fontSize: "32px",
                        show: true,
                    },
                },
            },
        },
        fill: { type: "solid" },
        stroke: { lineCap: "round" },
        labels: ["Nilai IKM"],
    };

    const getAkreditasiColorValue = (jumlahNilai) => {
        if (jumlahNilai >= 88.31) return "#22C55E";
        else if (jumlahNilai >= 76.61) return "#60A5FA";
        else if (jumlahNilai >= 65) return "#CA8A04";
        return "#DC2626";
    };

    const getAkreditasiTextColor = (jumlahNilai) => {
        if (jumlahNilai >= 88.31) return "text-green-500";
        else if (jumlahNilai >= 76.61) return "text-blue-400";
        else if (jumlahNilai >= 65) return "text-yellow-600";
        return "text-red-500";
    };

    const getDeskripsiNilai = (jumlahNilai) => {
        if (jumlahNilai >= 88.31) return "Sangat Baik";
        else if (jumlahNilai >= 76.61) return "Baik";
        else if (jumlahNilai >= 65) return "Kurang Baik";
        return "Tidak Baik";
    };

    useEffect(() => {
        const el = document.getElementById("respondent-count");
        if (el) el.textContent = dataCount || "-";
    }, [dataCount]);

    useEffect(() => {
        if (period) {
            const getChartData = async () => {
                setIsLoading(true);
                try {
                    const body = {
                        start_at: moment(period.start_at).format("YYYY-MM-DD"),
                        end_at: moment(period.end_at).format("YYYY-MM-DD"),
                        id_service: 0,
                    };
                    const response = await axios.get("/calculate-ikm", {
                        params: body,
                    });
                    const propertyNames = Object.keys(response.data.avg);
                    const nrr_ttb = propertyNames.map(
                        (v) => response.data.nrr_ttb[v],
                    );
                    const summedValue = nrr_ttb.reduce(
                        (acc, cur) => parseFloat(acc) + parseFloat(cur),
                        0,
                    );
                    const nilai = (summedValue * 25).toFixed(2);
                    setNilaiKonversi(nilai);
                    setAkreditasiColor(getAkreditasiTextColor(nilai));
                    setDataCount(response.data.count.count);
                } catch (error) {
                    console.error("Error fetching chart data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            getChartData();
        } else {
            setIsLoading(false);
        }
    }, [period]);

    return (
        <section className="relative overflow-hidden min-h-[500px]">
            <div className="grid lg:grid-cols-2 min-h-[500px] bg-[url('/images/bg2.jpeg')] bg-cover bg-center">
                <div className="flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-soft-light filter blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-soft-light filter blur-3xl"></div>
                    </div>
                    <div className="relative z-10 w-full max-w-md mx-auto space-y-6">
                        <img
                            src="/images/logodpmptsp_final.png"
                            className="w-auto h-28 mx-auto drop-shadow-lg"
                            alt="Logo DPMPTSP"
                        />
                        <div className="space-y-2">
                            <h1 className="xl:text-4xl md:text-3xl text-2xl font-extrabold text-white leading-tight">
                                Indeks Kepuasan Masyarakat
                            </h1>
                            <p className="text-blue-100 text-xl font-medium">
                                DPMPTSP Kabupaten Bekasi
                            </p>
                        </div>
                        <p className="text-blue-200 text-sm mt-4 max-w-md">
                            Sistem pengelolaan dan monitoring Indeks Kepuasan
                            Masyarakat untuk pelayanan publik yang lebih baik
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 pt-4">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium lg:basis-auto basis-[calc(50%-0.5rem)]">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <svg
                                        className="w-3 h-3 text-[hsl(199,86%,46%)]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                Transparan
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium lg:basis-auto basis-[calc(50%-0.5rem)]">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <svg
                                        className="w-3 h-3 text-[hsl(199,86%,46%)]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                Akuntabel
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium whitespace-nowrap lg:basis-auto basis-[calc(50%-0.5rem)]">
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <svg
                                        className="w-3 h-3 text-[hsl(199,86%,46%)]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                Berorientasi Layanan
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-3xl">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-white/50 rounded-2xl">
                            <CardContent className="flex flex-col items-center pt-8 pb-10">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-[220px]">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : !period ? (
                                    <div className="col-span-1 lg:col-span-2 text-center space-y-4 py-8">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                            <svg
                                                className="w-12 h-12 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-lg text-gray-500">
                                            Belum ada data periode
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-full">
                                            <ApexChart
                                                key={nilaiKonversi}
                                                options={{
                                                    ...radialOptions,
                                                    colors: [
                                                        getAkreditasiColorValue(
                                                            nilaiKonversi,
                                                        ),
                                                    ],
                                                }}
                                                series={[Number(nilaiKonversi)]}
                                                type="radialBar"
                                                height={220}
                                            />
                                        </div>
                                        <div className="text-center space-y-2 mt-3">
                                            <p
                                                className={`text-3xl font-bold ${akreditasiColor}`}
                                            >
                                                {getDeskripsiNilai(
                                                    nilaiKonversi,
                                                )}
                                            </p>
                                            <div className="flex justify-center gap-2">
                                                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
                                                    IKM: {nilaiKonversi}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-white/50 rounded-2xl">
                            <CardContent className="pt-8 pb-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-blue-50 rounded-xl p-5 text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg
                                                className="w-6 h-6 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-800">
                                            {dataCount || 0}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Total Responden
                                        </p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-5 text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg
                                                className="w-6 h-6 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-800">
                                            9
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Unsur Layanan
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-5 text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg
                                                className="w-6 h-6 text-purple-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-xl font-bold text-gray-800">
                                            {period
                                                ? moment(period.start_at)
                                                      .locale("id")
                                                      .format("MMMM")
                                                : "-"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Bulan Berjalan
                                        </p>
                                    </div>
                                    <div className="bg-orange-50 rounded-xl p-5 text-center">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg
                                                className="w-6 h-6 text-orange-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-xl font-bold text-gray-800">
                                            {period
                                                ? moment(
                                                      period.start_at,
                                                  ).format("YYYY")
                                                : "-"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Tahun Layanan
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
