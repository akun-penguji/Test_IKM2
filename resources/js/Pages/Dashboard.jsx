import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/Components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { educationList, jobList } from "@/Helper/constant";
import AuthenticatedLayout2 from "@/Layouts/AuthenticatedLayout2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import axios from "axios";
import ApexChart from "react-apexcharts";
import { X, BarChart3, Users, TrendingUp } from "lucide-react";
import moment from "moment/moment";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard({ auth, period, serviceId }) {
    const {
        data: passedData,
        setData: setPassedData,
        get: getPassedData,
    } = useForm({ serviceId });
    const [avgData, setAvgData] = useState([]);
    const [sumData, setSumData] = useState([]);
    const [avgTtbData, setAvgTtbData] = useState([]);
    const [nilai, setNilai] = useState(0);
    const [nilaiKonversi, setNilaiKonversi] = useState(0);
    const [akreditasiColor, setAkreditasiColor] = useState("");
    const [dataCount, setDataCount] = useState(0);
    const [countByGender, setCountByGender] = useState([]);
    const [countByEducation, setCountByEducation] = useState([]);
    const [countByJob, setCountByJob] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [isShowing, setIsShowing] = useState(true);

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

    const radialOptions = {
        chart: { height: 260, type: "radialBar" },
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
                        fontSize: "17px",
                    },
                    value: {
                        formatter: (val) => parseFloat(val).toFixed(2),
                        color: "#111",
                        fontSize: "36px",
                        show: true,
                    },
                },
            },
        },
        fill: { type: "solid" },
        stroke: { lineCap: "round" },
        labels: ["Nilai IKM"],
    };

    const barOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                },
            },
        },
        plotOptions: { bar: { horizontal: true, distributed: true } },
        xaxis: { categories },
        colors,
        tooltip: {
            enabled: true,
            theme: "light",
            y: { formatter: (val) => val.toFixed(2) },
        },
        dataLabels: { enabled: true, formatter: (value) => value.toFixed(2) },
    };

    const genderOptions = {
        chart: { type: "donut", toolbar: { show: true } },
        labels: ["Laki-laki", "Perempuan"],
        dataLabels: { enabled: true },
        tooltip: { enabled: true, theme: "light" },
        plotOptions: {
            pie: { donut: { size: "65%", labels: { show: true } } },
        },
        colors: ["#3B82F6", "#EC4899"],
    };

    const educationOptions = {
        chart: { type: "donut", toolbar: { show: true } },
        labels: ["SD", "SMP", "SMA", "S1", "S2", "S3"],
        dataLabels: { enabled: true },
        tooltip: { enabled: true, theme: "light" },
        plotOptions: {
            pie: { donut: { size: "65%", labels: { show: true } } },
        },
        colors: [
            "#8B5CF6",
            "#06B6D4",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#6366F1",
        ],
    };

    const jobOptions = {
        chart: { type: "donut", toolbar: { show: true } },
        labels: ["PNS", "TNI", "POLRI", "SWASTA", "WIRAUSAHA", "LAINNYA"],
        dataLabels: { enabled: true },
        tooltip: { enabled: true, theme: "light" },
        plotOptions: {
            pie: { donut: { size: "65%", labels: { show: true } } },
        },
        colors: [
            "#0EA5E9",
            "#8B5CF6",
            "#F43F5E",
            "#22C55E",
            "#EAB308",
            "#64748B",
        ],
    };

    const getDeskripsiNilai = (jumlahNilai) => {
        setAkreditasiColor("text-red-600");
        if (jumlahNilai >= 88.31) {
            setAkreditasiColor("text-green-500");
            return "Sangat Baik";
        } else if (jumlahNilai >= 76.61) {
            setAkreditasiColor("text-blue-400");
            return "Baik";
        } else if (jumlahNilai >= 65) {
            setAkreditasiColor("text-yellow-600");
            return "Kurang Baik";
        }
        return "Tidak Baik";
    };

    const getAkreditasiColorValue = (jumlahNilai) => {
        if (jumlahNilai >= 88.31) return "#22C55E";
        else if (jumlahNilai >= 76.61) return "#60A5FA";
        else if (jumlahNilai >= 65) return "#CA8A04";
        return "#DC2626";
    };

    const akreditasi = useMemo(
        () => getDeskripsiNilai(nilaiKonversi),
        [nilaiKonversi],
    );

    const filterData = () => getChartData();

    const getChartData = async () => {
        const body = {
            start_at: moment(period.start_at).format("YYYY-MM-DD"),
            end_at: moment(period.end_at).format("YYYY-MM-DD"),
            id_service: passedData.serviceId,
        };
        const response = await axios.get("/calculate-ikm", { params: body });
        const propertyNames = Object.keys(response.data.avg);
        const avg = propertyNames.map((v) => response.data.avg[v] * 25);
        const sum = propertyNames.map((v) => response.data.sum[v]);
        const nrr_ttb = propertyNames.map((v) => response.data.nrr_ttb[v]);
        setAvgData(avg);
        setSumData(sum);
        setAvgTtbData(nrr_ttb);
        const summedValue = nrr_ttb.reduce(
            (acc, cur) => parseFloat(acc) + parseFloat(cur),
            0,
        );
        setNilaiKonversi((summedValue * 25).toFixed(2));
        setDataCount(response.data.count.count);
        setCountByGender([
            response.data.countByGender["L"],
            response.data.countByGender["P"],
        ]);
        const educationCount = educationList.map(
            (v) => response.data.countByEducation[v],
        );
        const updatedJob = [...jobList, "LAINNYA"];
        const jobCount = updatedJob.map((v) => response.data.countByJob[v]);
        setCountByEducation(educationCount);
        setCountByJob(jobCount);
    };

    useEffect(() => {
        if (period) {
            axios.get("/service-list").then((r) => setServiceList(r.data));
            getChartData();
        }
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
        >
            <Head title="Dashboard" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {isShowing && (
                        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5" />
                                <span className="font-medium">
                                    Selamat datang, {auth.user.name}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20"
                                onClick={() => setIsShowing(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    )}

                    {period ? (
                        <>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>
                                        Periode:{" "}
                                        {moment(period.start_at).format(
                                            "DD MMM",
                                        )}{" "}
                                        -{" "}
                                        {moment(period.end_at).format(
                                            "DD MMM YYYY",
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select
                                        disabled={auth.user.roleId != 1}
                                        value={passedData.serviceId || ""}
                                        onValueChange={(v) =>
                                            setPassedData("serviceId", v)
                                        }
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Pilih layanan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">
                                                Semua Layanan
                                            </SelectItem>
                                            {serviceList.map((v) => (
                                                <SelectItem
                                                    key={v.id}
                                                    value={v.id}
                                                >
                                                    {v.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={filterData}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Filter
                                    </Button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-4 gap-6">
                                <Card className="lg:col-span-1 bg-white shadow-lg border-0 rounded-2xl">
                                    <CardHeader className="pb-2 border-b">
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                                            <TrendingUp className="w-4 h-4" />{" "}
                                            Nilai IKM
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center pt-4">
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
                                                height={240}
                                            />
                                        </div>
                                        <p
                                            className={`text-xl font-bold ${akreditasiColor}`}
                                        >
                                            {akreditasi}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {dataCount} responden
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="lg:col-span-3 bg-white shadow-lg border-0 rounded-2xl">
                                    <CardHeader className="pb-2 border-b">
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                                            <BarChart3 className="w-4 h-4" />{" "}
                                            Grafik IKM per Unsur
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ApexChart
                                            key={avgData.length}
                                            options={barOptions}
                                            series={[
                                                {
                                                    name: "Nilai Rata-rata",
                                                    data: avgData,
                                                },
                                            ]}
                                            type="bar"
                                            height={320}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                                    <CardHeader className="pb-2 border-b">
                                        <CardTitle className="text-sm font-semibold text-gray-600">
                                            Jenis Kelamin
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ApexChart
                                            options={genderOptions}
                                            series={countByGender}
                                            type="donut"
                                            height={260}
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                                    <CardHeader className="pb-2 border-b">
                                        <CardTitle className="text-sm font-semibold text-gray-600">
                                            Pendidikan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ApexChart
                                            options={educationOptions}
                                            series={countByEducation}
                                            type="donut"
                                            height={260}
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                                    <CardHeader className="pb-2 border-b">
                                        <CardTitle className="text-sm font-semibold text-gray-600">
                                            Pekerjaan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ApexChart
                                            options={jobOptions}
                                            series={countByJob}
                                            type="donut"
                                            height={260}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <BarChart3 className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-xl font-semibold text-gray-700">
                                Periode belum di publish
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Hubungi admin untuk informasi lebih lanjut
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

