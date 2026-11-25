import {
    educationList,
    jobList,
    educationListWithIcon,
    jobListWithIcon,
} from "@/Helper/constant";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
    Link,
    Head,
    useForm as useFormInertia,
    router,
} from "@inertiajs/react";
import {
    Box,
    Grid,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Divider,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Send, ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import { usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";

import { Input } from "@/Components/ui/input";

import { Checkbox } from "@/Components/ui/checkbox";

import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

import { Textarea } from "@/Components/ui/textarea";
import { Rating } from "@/Components/ui/rating";
import { Calendar1 } from "lucide-react";
import { Venus, Mars } from "lucide-react";
import ConditionalLayout from "../Layouts/ConditionalLayout";
import { CalendarIcon } from "lucide-react";
import { SelectableCard } from "@/Components/ui/selectable-card";

const respondentDataSchema = z.object({
    gender: z.string({
        required_error: "Anda belum mengisi jenis kelamin",
        invalid_type_error: "Anda belum mengisi jenis kelamin",
    }),
    education: z.string({
        required_error: "Anda belum mengisi pendidikan",
        invalid_type_error: "Anda belum mengisi pendidikan",
    }),
    job: z.string().min(1, {
        message: "Anda belum mengisi pekerjaan",
    }),
    serviceId: z.string({
        required_error: "Anda belum mengisi layanan",
        invalid_type_error: "Anda belum mengisi layanan",
    }),
    lokusId: z.string({
        required_error: "Anda belum memilih lokus",
        invalid_type_error: "Anda belum memilih lokus",
    }),
});

const questionSchema = z.object({
    q1: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q2: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q3: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q4: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q5: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q6: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q7: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q8: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
    q9: z.string({
        required_error: "Anda belum menjawab pertanyaan",
        invalid_type_error: "Anda belum menjawab pertanyaan",
    }),
});

const suggestionSchema = z.object({
    suggestion: z.string().optional(),
});

const validationSchema = [
    respondentDataSchema,
    questionSchema,
    suggestionSchema,
];

export default function Questionnaire({ auth, children, editData }) {
    const { data, setData, post, processing, errors, reset, patch } =
        useFormInertia({
            gender: "",
            education: "",
            job: "",
            serviceId: "",
            lokusId: "",
            q1: 0,
            q2: 0,
            q3: 0,
            q4: 0,
            q5: 0,
            q6: 0,
            q7: 0,
            q8: 0,
            q9: 0,
            suggestion: "",
            created_at: moment().toDate(),
        });

    function onSubmit(values) {
        if (activeStep === 0) {
            values.serviceId = parseInt(values.serviceId);
            if (values.lokusId) {
                values.lokusId = parseInt(values.lokusId);
            }

            setData({ ...values, created_at: data.created_at });
        }
        if (activeStep === 1) {
            Object.keys(values).map((key) => {
                values[key] = parseInt(values[key]);
            });
            setData({ ...data, ...values });
        }
        if (activeStep === 2) {
            setData({
                ...data,
                suggestion: values.suggestion,
                created_at: moment().format("YYYY-MM-DD"),
            });
            if (editData) {
                const id = editData.id || editData[0].id;
                patch(route("survey.update", id));
                reset();
            } else {
                post(route("survey.store"));
                reset();
            }
            return;
        }
        setActiveStep((v) => v + 1);
    }

    const { flash } = usePage().props;

    const [otherJob, setOtherJob] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [lokusList, setLokusList] = useState([]);
    const [questionList, setQuestionList] = useState([]);
    const [date, setDate] = useState(new Date());

    const steps = ["Informasi Responden", "Pertanyaan Survei", "Pesan & Saran"];
    const [activeStep, setActiveStep] = useState(0);
    const currentValidationSchema = useMemo(
        () => validationSchema[activeStep],
        [activeStep],
    );

    const form = useForm({
        resolver: zodResolver(currentValidationSchema),
        defaultValues: {
            gender: editData
                ? editData?.gender
                    ? editData?.gender
                    : editData[0]?.gender
                : null,
            education: editData
                ? editData?.education
                    ? editData?.education
                    : editData[0]?.education
                : null,
            job: editData
                ? editData?.job
                    ? editData?.job
                    : editData[0]?.job
                : null,
            serviceId: editData
                ? editData?.serviceId
                    ? editData?.serviceId.toString()
                    : editData[0]?.serviceId.toString()
                : null,
            lokusId: editData
                ? editData?.lokusId
                    ? editData?.lokusId.toString()
                    : editData[0]?.lokusId
                      ? editData[0]?.lokusId.toString()
                      : ""
                : "",
            q1: 0,
            q2: 0,
            q3: 0,
            q4: 0,
            q5: 0,
            q6: 0,
            q7: 0,
            q8: 0,
            q9: 0,
            suggestion: "",
            created_at: moment(),
        },
        validationSchema: currentValidationSchema,
    });

    useEffect(() => {
        const fetchService = async () => {
            const response = await axios.get("/service-list");
            setServiceList(response.data);
        };
        const fetchLokus = async () => {
            const response = await axios.get("/lokus-list");
            setLokusList(response.data);
        };
        const fetchQuestion = async () => {
            const response = await axios.get("/questions/survey");
            setQuestionList(response.data);
        };
        fetchService();
        fetchLokus();
        fetchQuestion();
        if (auth && auth.user && auth.user.roleId !== 1) {
            form.setFieldValue("serviceId", auth.user.id_service);
        }
    }, []);
    useEffect(() => {
        if (flash.message) {
            toast(flash.message, {
                type: "info",
                position: "bottom-center",
            });
        }
    }, [flash]);

    useEffect(() => {
        if (editData) {
            Object.keys(editData[0]).map((v) => {
                if (
                    v === "gender" &&
                    v === "education" &&
                    v === "job" &&
                    v === "suggestion"
                ) {
                    setData(v, editData[0][v]);
                    form.setValue(v, editData[0][v]);
                } else if (v === "created_at") {
                    setData(v, moment(editData[0][v]).toDate());
                    form.setValue(v, moment(editData[0][v]));
                } else if (v === "lokusId" && editData[0][v] === null) {
                    setData(v, "");
                    form.setValue(v, "");
                } else if (
                    editData[0][v] !== null &&
                    editData[0][v] !== undefined
                ) {
                    setData(v, editData[0][v].toString());
                    form.setValue(v, editData[0][v].toString());
                }
            });
        }
    }, [editData]);

    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = 768;
    useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);

    return (
        <>
            <ConditionalLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight bg-red">
                        Survey Kepuasan Masyarakat
                    </h2>
                }
            >
                <Head title="Survey" />
                <Box
                    sx={{
                        flexGrow: 1,
                        border: 2,
                        marginTop: 2,
                        borderColor: "primary.main",
                    }}
                >
                    <Grid container spacing={2} className="bg-blue-400 mb-5">
                        <Grid item xs={12} marginBottom={4}>
                            <Stepper
                                activeStep={activeStep}
                                alternativeLabel
                                classes={{ nonLinear: "bg-white" }}
                            >
                                {steps.map((label) => (
                                    <Step
                                        key={label}
                                        sx={{
                                            "& .MuiStepLabel-root .Mui-completed":
                                                {
                                                    color: "primary.main",
                                                },
                                            "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                                                {
                                                    color: "white",
                                                    fontWeight: "bold",
                                                },
                                            "& .MuiStepLabel-root .Mui-active":
                                                {
                                                    color: "primary.main",
                                                },
                                            "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                                                {
                                                    color: "white",
                                                    fontWeight: "bold",
                                                },
                                            "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text":
                                                {
                                                    fill: "white",
                                                },
                                            "& .MuiStepLabel-root .Mui-disabled":
                                                {
                                                    color: "white",
                                                },
                                            "& .MuiStepLabel-root .Mui-disabled .MuiStepIcon-root":
                                                {
                                                    fill: "white",
                                                },
                                            "& .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel":
                                                {
                                                    color: "white",
                                                },
                                        }}
                                    >
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Grid>
                    </Grid>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="px-4 pb-4"
                        >
                            {activeStep === 0 && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field, fieldState }) => (
                                                <SelectableCard
                                                    label="Jenis Kelamin"
                                                    options={[
                                                        {
                                                            value: "P",
                                                            label: "Perempuan",
                                                            icon: (
                                                                <Venus className="w-8 h-8" />
                                                            ),
                                                        },
                                                        {
                                                            value: "L",
                                                            label: "Laki-laki",
                                                            icon: (
                                                                <Mars className="w-8 h-8" />
                                                            ),
                                                        },
                                                    ]}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={
                                                        fieldState.error
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormField
                                            control={form.control}
                                            name="education"
                                            render={({ field, fieldState }) => (
                                                <SelectableCard
                                                    label="Pendidikan"
                                                    options={
                                                        educationListWithIcon
                                                    }
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={
                                                        fieldState.error
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormField
                                            control={form.control}
                                            name="job"
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <SelectableCard
                                                        label="Pekerjaan"
                                                        options={
                                                            jobListWithIcon
                                                        }
                                                        value={
                                                            otherJob
                                                                ? ""
                                                                : field.value
                                                        }
                                                        onChange={(val) => {
                                                            if (!otherJob) {
                                                                field.onChange(
                                                                    val,
                                                                );
                                                            }
                                                        }}
                                                        error={
                                                            fieldState.error
                                                                ?.message
                                                        }
                                                    />
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <Checkbox
                                                            id="otherJob"
                                                            checked={otherJob}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) => {
                                                                setOtherJob(
                                                                    checked,
                                                                );
                                                                if (checked) {
                                                                    field.onChange(
                                                                        "",
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor="otherJob">
                                                            Pekerjaan lainnya
                                                        </Label>
                                                    </div>
                                                    {otherJob && (
                                                        <Input
                                                            {...field}
                                                            placeholder="Masukkan pekerjaan lain"
                                                            className="text-sm mt-2"
                                                        />
                                                    )}
                                                </>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormField
                                            control={form.control}
                                            name="lokusId"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col gap-1">
                                                    <FormLabel className="mb-2 text-base">
                                                        Lokus
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Lokus" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent
                                                            className={
                                                                "bg-white" +
                                                                (lokusList.length >
                                                                4
                                                                    ? " h-[200px] overflow-y-auto"
                                                                    : "")
                                                            }
                                                        >
                                                            {lokusList.map(
                                                                (lokus) => (
                                                                    <SelectItem
                                                                        key={lokus.id.toString()}
                                                                        value={lokus.id.toString()}
                                                                    >
                                                                        {
                                                                            lokus.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormField
                                            control={form.control}
                                            name="serviceId"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col gap-1">
                                                    <FormLabel className="mb-2 text-base">
                                                        Layanan
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Layanan" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-white h-[200px] overflow-y-auto">
                                                            {serviceList.map(
                                                                (service) => (
                                                                    <SelectItem
                                                                        key={service.id.toString()}
                                                                        value={service.id.toString()}
                                                                    >
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />
                                    </Grid>
                                    {auth?.user && (
                                        <Grid item xs={12} md={6}>
                                            <FormItem className="flex flex-col gap-1">
                                                <FormLabel className="mb-2 text-base">
                                                    Tanggal Input
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] justify-start text-left font-normal",
                                                                !data.created_at &&
                                                                    "text-muted-foreground",
                                                            )}
                                                        >
                                                            <CalendarIcon />
                                                            {data.created_at ? (
                                                                format(
                                                                    data.created_at,
                                                                    "PPP",
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={
                                                                data.created_at
                                                            }
                                                            onSelect={(e) =>
                                                                setData(
                                                                    "created_at",
                                                                    e,
                                                                )
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        </Grid>
                                    )}
                                </Grid>
                            )}

                            {activeStep === 1 && width > breakpoint && (
                                <Grid container spacing={3}>
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        className="order-1"
                                    >
                                        <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
                                            {questionList.map((v, i) => (
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name={`q${i + 1}`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col gap-1 mb-4">
                                                                <FormLabel
                                                                    className="mb-2 text-base text-left"
                                                                    id={`question-label${
                                                                        i + 1
                                                                    }`}
                                                                >
                                                                    {v.seq +
                                                                        ". " +
                                                                        v.name}
                                                                </FormLabel>
                                                                <FormControl className="justify-center md:justify-center">
                                                                    <Rating
                                                                        onValueChange={
                                                                            field.onChange
                                                                        }
                                                                        value={
                                                                            field.value
                                                                        }
                                                                        count={
                                                                            4
                                                                        }
                                                                        variant="star"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage className="text-red-500" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <hr className="mt-5 mb-4" />
                                                </>
                                            ))}
                                        </div>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        className="order-2 hidden md:block"
                                    >
                                        <div className="sticky top-4">
                                            <img
                                                src="/images/questionnaire2.jpg"
                                                alt="Questionnaire"
                                                className="w-full h-auto rounded-lg shadow-lg"
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            )}
                            {activeStep === 1 && width <= breakpoint && (
                                <Grid container spacing={3}>
                                    {questionList.map((v, i) => (
                                        <Grid item xs={12} key={i}>
                                            <FormField
                                                control={form.control}
                                                name={`q${i + 1}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col gap-1">
                                                        <FormLabel
                                                            className="mb-2 text-base text-left md:text-center"
                                                            id={`question-label${
                                                                i + 1
                                                            }`}
                                                        >
                                                            {v.seq +
                                                                ". " +
                                                                v.name}
                                                        </FormLabel>
                                                        <FormControl className="justify-center md:justify-center">
                                                            <Rating
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                count={4}
                                                                variant="star"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-red-500" />
                                                    </FormItem>
                                                )}
                                            />
                                            <hr className="mt-5" />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            {(activeStep === 2 || activeStep === 3) && (
                                <FormField
                                    control={form.control}
                                    name="suggestion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                Pesan & Saran
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Masukkan pesan dan saran anda"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <Stack
                                direction="row"
                                justifyContent={
                                    activeStep < 1 ? "end" : "space-between"
                                }
                                marginTop={4}
                            >
                                {activeStep > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setActiveStep((v) => v - 1)
                                        }
                                        className="flex items-center"
                                    >
                                        <ArrowBackIos
                                            className="mr-1"
                                            fontSize="2"
                                        />
                                        Kembali
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    className="flex items-center"
                                >
                                    {activeStep >= 2 ? "Kirim" : "Lanjut"}
                                    {activeStep >= 2 ? (
                                        <Send className="ml-1" fontSize="2" />
                                    ) : (
                                        <ArrowForwardIos
                                            fontSize="2"
                                            className="ml-1"
                                        />
                                    )}
                                </Button>
                            </Stack>
                        </form>
                    </Form>
                </Box>
            </ConditionalLayout>
        </>
    );
}
