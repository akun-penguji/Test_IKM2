import { educationList, jobList } from "@/Helper/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import axios from "axios";
import ApexChart from "react-apexcharts";
import moment from "moment/moment";
import { useState, useEffect } from "react";

export default function Chart({ period }) {
    const [avgData, setAvgData] = useState([]);
    const [countByGender, setCountByGender] = useState([]);
    const [countByEducation, setCountByEducation] = useState([]);
    const [countByJob, setCountByJob] = useState([]);

    const categories = [
        "Persyaratan",
        "Sistem, mekanisme, dan prosedur",
        "Waktu penyelesaian",
        "Biaya/Tarif",
        "Produk spesifikasi jenis pelayanan",
        "Kompetensi pelaksana",
        "Perilaku pelaksana",
        "Sarana dan prasana",
        "Penanganan pengaduan, saran dan masukan",
    ];
    const colors = [
        "#C42525",
        "#F28F43",
        "#910000",
        "#8BBC21",
        "#A6C96A",
        "#E4D354",
        "#2F7ED8",
        "#77A1E5",
        "#8085E9",
    ];

    const barOptions = {
        chart: { type: "bar", toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } } },
        plotOptions: { bar: { horizontal: true, distributed: true } },
        xaxis: { categories },
        colors,
        tooltip: { enabled: true, theme: "light", y: { formatter: (val) => val.toFixed(2) } },
        dataLabels: { enabled: true, formatter: (value) => value.toFixed(2) },
    };

    const pieOptions = {
        chart: { type: "donut", toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } } },
        labels: ["Laki-laki", "Perempuan"],
        dataLabels: { enabled: true },
        tooltip: { enabled: true, theme: "light" },
        plotOptions: { pie: { donut: { size: "65%", labels: { show: true } } } },
        colors: ["#3B82F6", "#EC4899"],
    };

    const educationOptions = {
        chart: { type: "donut", toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } } },
        labels: ["SD", "SMP", "SMA", "S1", "S2", "S3"],
        dataLabels: { enabled: true },
        tooltip: { enabled: true, theme: "light" },
        plotOptions: { pie: { donut: { size: "65%", labels: { show: true } } } },
        colors: ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#6366F1"],
    };

    const jobOptions = {
        chart: { type: "donut", toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } } },
        labels: ["PNS", "TNI", "POLRI", "SWASTA", "WIRAUSAHA", "LAINNYA"],
        dataLabels: { enabled: true },
        tooltip: { enabled: true, theme: "light" },
        plotOptions: { pie: { donut: { size: "65%", labels: { show: true } } } },
        colors: ["#0EA5E9", "#8B5CF6", "#F43F5E", "#22C55E", "#EAB308", "#64748B"],
    };

    useEffect(() => {
        if (period) {
            const getChartData = async () => {
                const body = {
                    start_at: moment(period.start_at).format("YYYY-MM-DD"),
                    end_at: moment(period.end_at).format("YYYY-MM-DD"),
                    id_service: 0,
                };
                const response = await axios.get("/calculate-ikm", { params: body });
                const propertyNames = Object.keys(response.data.avg);
                const avg = propertyNames.map((v) => response.data.avg[v] * 25);
                setAvgData(avg);
                setCountByGender([response.data.countByGender["L"], response.data.countByGender["P"]]);
                const educationCount = educationList.map((v) => response.data.countByEducation[v]);
                const updatedJob = [...jobList, "LAINNYA"];
                const jobCount = updatedJob.map((v) => response.data.countByJob[v]);
                setCountByEducation(educationCount);
                setCountByJob(jobCount);
            };
            getChartData();
        }
    }, [period]);

    if (!period) return null;

    return (
        <div className="grid gap-6">
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-600">IKM Berdasarkan Unsur Pelayanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <ApexChart key={avgData.length} options={barOptions} series={[{ name: "Nilai Rata-rata", data: avgData }]} type="bar" height={350} />
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-600">Jenis Kelamin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApexChart options={pieOptions} series={countByGender} type="donut" height={280} />
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-600">Pendidikan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApexChart options={educationOptions} series={countByEducation} type="donut" height={280} />
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-600">Pekerjaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApexChart options={jobOptions} series={countByJob} type="donut" height={280} />
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-sm text-gray-400 pb-8">
                Periode: {moment(period.start_at).format("DD MMM YYYY")} - {moment(period.end_at).format("DD MMM YYYY")}
            </div>
        </div>
    );
}