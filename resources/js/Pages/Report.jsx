import DialogEditPeriod from "@/Components/DialogEditPeriod";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Delete, Edit, HelpOutline, Add } from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Tooltip,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Calendar1 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { DataTable } from "@/Components/ui/DataTable";
import { Badge } from "@/Components/ui/badge";
import { Sheet } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Loader } from "lucide-react";

const reportSchema = z.object({
    bulan: z.string({
        required_error: "Anda belum mengisi bulan",
    }),
    tahun: z.string({
        required_error: "Anda belum mengisi tahun",
        invalid_type_error: "Anda belum mengisi tahun",
    }),
});

const surveyReportSchema = z.object({
    startDate: z.date({
        required_error: "Tanggal mulai harus diisi",
    }),
    endDate: z.date({
        required_error: "Tanggal akhir harus diisi",
    }),
});

export default function Period({ auth, data, periodList }) {
    const { flash } = usePage().props;
    const [selectedId, setSelectedId] = useState(0);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState(0);
    const [open, setOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [startYear, setStartYear] = useState(
        moment().subtract(1, "year").year(),
    );
    const [endYear, setEndYear] = useState(moment().add(5, "year").year());
    const [loading, setLoading] = useState(false);
    const [surveyLoading, setSurveyLoading] = useState(false);

    const yearList = useMemo(() => {
        const years = [];
        for (let i = startYear; i <= endYear; i++) {
            years.push(i);
        }
        return years;
    }, [startYear, endYear]);

    const form = useForm({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            bulan: moment().get("month").toString(),
            tahun: moment().get("year").toString(),
        },
    });

    const surveyForm = useForm({
        resolver: zodResolver(surveyReportSchema),
        defaultValues: {
            startDate: new Date(),
            endDate: new Date(),
        },
    });

    const months = [
        { value: "0", label: "Januari" },
        { value: "1", label: "Februari" },
        { value: "2", label: "Maret" },
        { value: "3", label: "April" },
        { value: "4", label: "Mei" },
        { value: "5", label: "Juni" },
        { value: "6", label: "Juli" },
        { value: "7", label: "Agustus" },
        { value: "8", label: "September" },
        { value: "9", label: "Oktober" },
        { value: "10", label: "November" },
        { value: "11", label: "Desember" },
    ];

    async function onSubmit(values) {
        setLoading(true);
        const label = months[values.bulan].label;
        values.bulan = parseInt(values.bulan) + 1;
        const date = moment(
            parseInt(values.tahun) + "-" + values.bulan + "-01",
        );
        const startDate = date.startOf("M").format("YYYY-MM-DD hh:mm:ss");
        const endDate = date.endOf("M").format("YYYY-MM-DD hh:mm:ss");
        try {
            const response = await axios.post(
                "/report",
                {
                    startDate,
                    endDate,
                    monthLabel: label,
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
            link.download = `Jumlah SKM ${label} - ${values.tahun}.xlsx`;
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        setLoading(false);
    }

    async function onSurveySubmit(values) {
        setSurveyLoading(true);
        const startDate = moment(values.startDate).format("YYYY-MM-DD");
        const endDate = moment(values.endDate).format("YYYY-MM-DD");

        try {
            const response = await axios.post(
                "/download-survey",
                {
                    startDate,
                    endDate,
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
            link.download = `Data Survey ${startDate} - ${endDate}.xlsx`;
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading survey file:", error);
            toast.error("Gagal mengunduh data survey");
        }
        setSurveyLoading(false);
    }

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
                                <BreadcrumbLink>Perhitungan IKM</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Perhitungan Periode
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            >
                <Head title="Penentuan Periode" />
                <div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 h-full">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-full py-5">
                            <div className="flex flex-col p-3 text-start border-secondary">
                                <Form {...form}>
                                    <p className="text-lg font-bold mb-5">
                                        Download Laporan SKM
                                    </p>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="flex flex-col gap-5 items-start mb-5"
                                    >
                                        <div className="flex flex-row items-center justify-center gap-5">
                                            <FormField
                                                control={form.control}
                                                name="bulan"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Bulan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <select
                                                                className="w-[240px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                {months.map(
                                                                    (month) => (
                                                                        <option
                                                                            key={
                                                                                month.value
                                                                            }
                                                                            value={
                                                                                month.value
                                                                            }
                                                                        >
                                                                            {
                                                                                month.label
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage className="text-red-500" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="tahun"
                                                className="w-[240px]"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tahun
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih tahun" />
                                                            </SelectTrigger>
                                                            <SelectContent className="px-2 bg-white overflow-y-auto">
                                                                {yearList.map(
                                                                    (year) => (
                                                                        <SelectItem
                                                                            key={
                                                                                year
                                                                            }
                                                                            value={year.toString()}
                                                                        >
                                                                            {year.toString()}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-red-500" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                className="bg-green-600 hover:bg-green-500"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Sheet />
                                                )}
                                                Download Excel
                                            </Button>
                                        </div>
                                    </form>
                                </Form>

                                {/* New Survey Data Form */}
                                <div className="border-t pt-8 mt-8">
                                    <Form {...surveyForm}>
                                        <p className="text-lg font-bold mb-5">
                                            Download Data Survey
                                        </p>
                                        <form
                                            onSubmit={surveyForm.handleSubmit(
                                                onSurveySubmit,
                                            )}
                                            className="flex flex-col gap-5 items-start mb-5"
                                        >
                                            <div className="flex flex-row items-center justify-center gap-5">
                                                <FormField
                                                    control={surveyForm.control}
                                                    name="startDate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>
                                                                Tanggal Mulai
                                                            </FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger
                                                                    asChild
                                                                >
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={
                                                                                "outline"
                                                                            }
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value &&
                                                                                    "text-muted-foreground",
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(
                                                                                    field.value,
                                                                                    "PPP",
                                                                                )
                                                                            ) : (
                                                                                <span>
                                                                                    Pilih
                                                                                    tanggal
                                                                                </span>
                                                                            )}
                                                                            <Calendar1 className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-auto p-0 bg-white"
                                                                    align="start"
                                                                >
                                                                    <Calendar
                                                                        mode="single"
                                                                        captionLayout="dropdown"
                                                                        fromYear={
                                                                            2020
                                                                        }
                                                                        selected={
                                                                            field.value
                                                                        }
                                                                        onSelect={
                                                                            field.onChange
                                                                        }
                                                                        disabled={(
                                                                            date,
                                                                        ) =>
                                                                            date >
                                                                            new Date()
                                                                        }
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={surveyForm.control}
                                                    name="endDate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>
                                                                Tanggal Akhir
                                                            </FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger
                                                                    asChild
                                                                >
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={
                                                                                "outline"
                                                                            }
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value &&
                                                                                    "text-muted-foreground",
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(
                                                                                    field.value,
                                                                                    "PPP",
                                                                                )
                                                                            ) : (
                                                                                <span>
                                                                                    Pilih
                                                                                    tanggal
                                                                                </span>
                                                                            )}
                                                                            <Calendar1 className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-auto p-0 bg-white"
                                                                    align="start"
                                                                >
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={
                                                                            field.value
                                                                        }
                                                                        onSelect={
                                                                            field.onChange
                                                                        }
                                                                        disabled={(
                                                                            date,
                                                                        ) =>
                                                                            date >
                                                                            new Date()
                                                                        }
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage className="text-red-500" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    type="submit"
                                                    className="bg-green-600 hover:bg-green-500"
                                                    disabled={surveyLoading}
                                                >
                                                    {surveyLoading ? (
                                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Sheet />
                                                    )}
                                                    Download Excel
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
