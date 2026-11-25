import DialogAddRTL from "@/Components/DialogAddRTL";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Edit } from "@mui/icons-material";
import { Typography } from "@mui/material";
import axios from "axios";
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
import { Button } from "@/Components/ui/button";
import { DataTable } from "@/Components/ui/DataTable";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Sheet } from "lucide-react";
import { Loader } from "lucide-react";

export default function RTL({ auth, data, period, serviceId, periodId }) {
    const [selectedId, setSelectedId] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [listUnsur, setListUnsur] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [periodList, setPeriodList] = useState([]);
    const [yearList, setYearList] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const { flash } = usePage().props;
    const [loading, setLoading] = useState(false);

    const {
        data: passedData,
        setData: setPassedData,
        get: getPassedData,
    } = useForm({
        serviceId,
        periodId,
    });

    const columns = [
        {
            accessorKey: "unsurId",
            header: "Prioritas Unsur",
            size: 200,
            cell: ({ row }) => row.original.unsur?.name,
        },
        {
            accessorKey: "nilai",
            header: "Nilai IKM",
            size: 100,
        },
        {
            accessorKey: "saran",
            header: "Keluhan / Saran",
            size: 200,
        },
        {
            accessorKey: "program",
            header: "Program / Kegiatan",
            size: 200,
        },
        {
            accessorKey: "tahun",
            header: "Waktu (tahun)",
            size: 100,
        },
        {
            accessorKey: "pj",
            header: "Penanggungjawab",
            size: 200,
        },
        {
            id: "actions",
            header: "Aksi",
            size: 80,
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    onClick={() => handleEdit(row.original.id, row.original)}
                    className="h-8 w-8 p-0"
                >
                    <Edit className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    const handleAddNewRTL = () => {
        setIsEdit(false);
        setOpen(true);
    };

    const handleEdit = (id, row) => {
        setIsEdit(true);
        setSelectedId(id);
        setSelectedData(row);
        setOpen(true);
    };

    const refresh = () => {
        getPassedData(route("rtl.index"));
    };

    const filterData = () => {
        refresh();
    };

    const downloadExcel = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "/rtl-excel",
                {
                    serviceId: passedData.serviceId,
                    periodId: passedData.periodId,
                },
                {
                    responseType: "arraybuffer",
                },
            );

            const blob = new Blob([response.data], {
                type: "application/octet-stream",
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "Rencana Tindak Lanjut.xlsx";
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        setLoading(false);
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
        if (selectedYear) {
            const getListPeriod = async () => {
                const response = await axios.get("/period-by-year", {
                    params: {
                        year: selectedYear,
                    },
                });
                setPeriodList(response.data);
            };
            getListPeriod();
        }
    }, [selectedYear]);

    useEffect(() => {
        const getListUnsur = async () => {
            const response = await axios.get("/unsur-list");
            setListUnsur(response.data);
        };
        const getListService = async () => {
            const response = await axios.get("/service-list");
            setServiceList(response.data);
        };
        const getListYear = async () => {
            const response = await axios.get("/period-year");
            setYearList(response.data);
        };
        getListYear();
        getListService();
        getListUnsur();
    }, []);

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
                                    Rencana Tindak Lanjut
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Rencana Tindak Lanjut" />
                <div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="container mx-auto pb-10">
                                <Typography
                                    variant="h5"
                                    className="text-center my-4"
                                    fontWeight={"bold"}
                                >
                                    Periode :{" "}
                                    {period
                                        ? moment(period.start_at).format(
                                              "DD MMM YYYY",
                                          ) +
                                          " - " +
                                          moment(period.end_at).format(
                                              "DD MMM YYYY",
                                          )
                                        : "-"}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    className="text-center mb-4"
                                    fontWeight={"bold"}
                                >
                                    Layanan :{" "}
                                    {data[0]?.service
                                        ? data[0].service.name
                                        : "Semua"}
                                </Typography>

                                <div className="flex flex-row justify-between items-center my-3 gap-5">
                                    <div className="flex flex-row justify-center items-center mb-3 gap-3">
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="year">Tahun</Label>
                                            <Select
                                                value={selectedYear}
                                                onValueChange={(value) =>
                                                    setSelectedYear(value)
                                                }
                                                disabled={yearList.length === 0}
                                            >
                                                <SelectTrigger id="year">
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {yearList.map((v) => (
                                                        <SelectItem
                                                            key={v}
                                                            value={v.toString()}
                                                        >
                                                            {v}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="period">
                                                Periode
                                            </Label>
                                            <Select
                                                value={
                                                    passedData.periodId
                                                        ? passedData.periodId.toString()
                                                        : ""
                                                }
                                                onValueChange={(value) =>
                                                    setPassedData(
                                                        "periodId",
                                                        value,
                                                    )
                                                }
                                                disabled={
                                                    !selectedYear ||
                                                    periodList.length === 0
                                                }
                                            >
                                                <SelectTrigger
                                                    id="period"
                                                    className="min-w-40"
                                                >
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {periodList.map((v) => (
                                                        <SelectItem
                                                            key={v.id}
                                                            value={v.id.toString()}
                                                        >
                                                            {v.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            onClick={filterData}
                                            variant="default"
                                            className="mt-6"
                                        >
                                            Filter
                                        </Button>
                                    </div>

                                    <div className="flex flex-row justify-center items-center mb-3 gap-3">
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="service">
                                                Layanan
                                            </Label>
                                            <Select
                                                value={
                                                    passedData.serviceId
                                                        ? passedData.serviceId.toString()
                                                        : ""
                                                }
                                                onValueChange={(value) =>
                                                    setPassedData(
                                                        "serviceId",
                                                        value === "null"
                                                            ? null
                                                            : value,
                                                    )
                                                }
                                                disabled={
                                                    auth.user.roleId !== 1
                                                }
                                            >
                                                <SelectTrigger id="service">
                                                    <SelectValue placeholder="Pilih Layanan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="null">
                                                        Semua Layanan
                                                    </SelectItem>
                                                    {serviceList.map((v) => (
                                                        <SelectItem
                                                            key={v.id}
                                                            value={v.id.toString()}
                                                        >
                                                            {v.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            onClick={filterData}
                                            variant="default"
                                            className="mt-6"
                                        >
                                            Filter
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-row justify-end items-center mb-4">
                                    <Button
                                        onClick={downloadExcel}
                                        variant="default"
                                        className="bg-green-600 text-white hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader className="mr-2" />
                                        ) : (
                                            <Sheet />
                                        )}
                                        Download Excel
                                    </Button>
                                </div>

                                {period ? (
                                    data.length > 0 ? (
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            hideColumnFilter
                                        />
                                    ) : (
                                        <Typography
                                            textAlign={"center"}
                                            variant="h4"
                                            margin={4}
                                        >
                                            Data Kosong
                                        </Typography>
                                    )
                                ) : (
                                    <Typography
                                        textAlign={"center"}
                                        variant="h4"
                                        margin={4}
                                    >
                                        Periode belum di setting
                                    </Typography>
                                )}

                                <DialogAddRTL
                                    id={selectedId}
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    data={selectedData}
                                    isEdit={isEdit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
