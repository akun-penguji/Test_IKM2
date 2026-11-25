import DialogAddService from "@/Components/DialogAddService";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Add } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
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
import { Typography } from "@mui/material";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Loader } from "lucide-react";
import { Sheet } from "lucide-react";

export default function TablePerhitungan({
    auth,
    data,
    calculation,
    serviceId,
    periodId,
    period,
}) {
    const {
        data: passedData,
        setData: setPassedData,
        get: getPassedData,
    } = useForm({
        serviceId,
        periodId,
    });
    const [serviceList, setServiceList] = useState([]);
    const [periodList, setPeriodList] = useState([]);
    const [yearList, setYearList] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const { flash } = usePage().props;
    const [loading, setLoading] = useState(false);

    console.log(calculation);
    const columns = [
        {
            accessorKey: "no",
            header: "No.",
            size: 50,
        },
        {
            accessorKey: "q1",
            header: "U1",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q2",
            header: "U2",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q3",
            header: "U3",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q4",
            header: "U4",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q5",
            header: "U5",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q6",
            header: "U6",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q7",
            header: "U7",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q8",
            header: "U8",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
        {
            accessorKey: "q9",
            header: "U9",
            size: 50,
            cell: ({ getValue }) => (
                <div className="text-center">{getValue()}</div>
            ),
        },
    ];

    const rows = useMemo(
        () =>
            data
                ? data.map((v, i) => ({
                      no: i + 1,
                      ...v,
                  }))
                : [],
        [data],
    );

    const sumData = useMemo(() => calculation.sum, [calculation.sum]);
    const avgData = useMemo(() => calculation.avg, [calculation.avg]);
    const sumAvgData = useMemo(() => calculation.sumAvg, [calculation.sumAvg]);
    const ikmData = useMemo(() => calculation.ikm, [calculation.ikm]);
    const avgTtbData = useMemo(
        () => calculation.avg_ttb,
        [calculation.avg_ttb],
    );

    const refresh = () => {
        getPassedData(route("table.calculate"));
    };

    const filterData = () => {
        refresh();
    };

    const downloadExcel = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "/ikm-excel",
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
            link.download = "Indeks Kepuasan Masyarakat.xlsx";
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        } finally {
            setLoading(false);
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
        const getListService = async () => {
            const response = await axios.get("/service-list");
            setServiceList(response.data);
        };
        const getListYear = async () => {
            const response = await axios.get("/period-year");
            setYearList(response.data);
        };
        getListService();
        getListYear();
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
                                <BreadcrumbPage>Tabel IKM</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Tabel IKM" />
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
                                    {moment(period.start_at).format(
                                        "DD MMM YYYY",
                                    )}{" "}
                                    -{" "}
                                    {moment(period.end_at).format(
                                        "DD MMM YYYY",
                                    )}
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

                                {data && data.length > 0 ? (
                                    <div className="flex flex-col gap-5">
                                        <DataTable
                                            columns={columns}
                                            data={rows}
                                            hideColumnFilter
                                        />
                                        <Card className="mb-4">
                                            <CardContent className="p-0">
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="w-[10%] font-medium">
                                                                &Sigma;Nilai/Unsur
                                                            </TableCell>
                                                            {sumData["q1"] &&
                                                                Object.keys(
                                                                    sumData,
                                                                ).map((v) => (
                                                                    <TableCell
                                                                        key={v}
                                                                    >
                                                                        {
                                                                            sumData[
                                                                                v
                                                                            ]
                                                                        }
                                                                    </TableCell>
                                                                ))}
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="w-[10%] font-medium">
                                                                NRR/Unsur
                                                            </TableCell>
                                                            {avgData["q1"] &&
                                                                Object.keys(
                                                                    avgData,
                                                                ).map((v) => (
                                                                    <TableCell
                                                                        key={v}
                                                                    >
                                                                        {parseFloat(
                                                                            avgData[
                                                                                v
                                                                            ],
                                                                        ).toFixed(
                                                                            3,
                                                                        )}
                                                                    </TableCell>
                                                                ))}
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="w-[10%] font-medium">
                                                                NRR tertbg/Unsur
                                                            </TableCell>
                                                            {avgTtbData["q1"] &&
                                                                Object.keys(
                                                                    avgTtbData,
                                                                ).map((v) => (
                                                                    <TableCell
                                                                        key={v}
                                                                    >
                                                                        {parseFloat(
                                                                            avgTtbData[
                                                                                v
                                                                            ],
                                                                        ).toFixed(
                                                                            3,
                                                                        )}
                                                                    </TableCell>
                                                                ))}
                                                        </TableRow>
                                                        <TableRow className="border-0">
                                                            <TableCell
                                                                colSpan={9}
                                                                className="text-right"
                                                            >
                                                                *)
                                                            </TableCell>
                                                            <TableCell>
                                                                **)
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="w-[10%] font-medium">
                                                                IKM Unit
                                                                Pelayanan
                                                            </TableCell>
                                                            <TableCell
                                                                colSpan={8}
                                                                className="text-right"
                                                            >
                                                                {sumAvgData.toFixed(
                                                                    3,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {ikmData.toFixed(
                                                                    3,
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-0">
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="w-[20%]">
                                                                <p className="font-bold">
                                                                    Keterangan
                                                                </p>
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                U1 s.d. U9
                                                            </TableCell>
                                                            <TableCell>
                                                                Unsur-unsur
                                                                pelayanan
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                NRR
                                                            </TableCell>
                                                            <TableCell>
                                                                Nilai rata-rata
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                IKM
                                                            </TableCell>
                                                            <TableCell>
                                                                Indeks Kepuasan
                                                                Masyarakat
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                *)
                                                            </TableCell>
                                                            <TableCell>
                                                                Jumlah NRR IKM
                                                                tertimbang
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                **)
                                                            </TableCell>
                                                            <TableCell>
                                                                Jumlah NRR
                                                                tertimbang x 25
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                NRR Per Unsur
                                                            </TableCell>
                                                            <TableCell>
                                                                Jumlah nilai per
                                                                unsur dibagi
                                                                jumlah survey
                                                                yang terisi
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                NRR tertimbang
                                                            </TableCell>
                                                            <TableCell>
                                                                NRR per unsur x
                                                                0,111 per unsur
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ) : (
                                    <Typography
                                        textAlign={"center"}
                                        variant="h4"
                                        margin={4}
                                    >
                                        Data Kosong
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
