import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar1 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { Edit } from "@mui/icons-material";
import { Dialog, DialogTitle } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const periodSchema = z.object({
    name: z.string().min(1, { message: "Anda belum mengisi nama periode" }),
    start_at: z.date({
        required_error: "Pilih tanggal mulai",
    }),
    end_at: z.date({
        required_error: "Pilih tanggal akhir",
    }),
    is_active: z
        .string()
        .min(1, { message: "Anda belum memilih status aktif" }),
    is_published: z
        .string()
        .min(1, { message: "Anda belum memilih status publish" }),
});

const DialogEditPeriod = ({ onClose, open, id, data }) => {
    const form = useForm({
        resolver: zodResolver(periodSchema),
        defaultValues: {
            name: "",
            start_at: new Date(),
            end_at: new Date(),
            is_active: "0",
            is_published: "0",
        },
    });

    const handleSubmit = (values) => {
        try {
            router.patch("/periods/" + id, {
                ...values,
                is_active: parseInt(values.is_active),
                is_published: parseInt(values.is_published),
                start_at: moment(values.start_at).format("YYYY-MM-DD hh:mm:ss"),
                end_at: moment(values.end_at).format("YYYY-MM-DD hh:mm:ss"),
            });
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (data && data.id) {
            form.setValue("name", data.name);
            form.setValue("start_at", new Date(data.start_at));
            form.setValue("end_at", new Date(data.end_at));
            form.setValue("is_active", data.is_active.toString());
            form.setValue("is_published", data.is_published.toString());
        }
    }, [data]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth>
            <DialogTitle className="font-bold">Ubah Periode</DialogTitle>
            <div className="px-6 pb-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Periode</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nama Periode"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="start_at"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tanggal Mulai</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
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
                                                            Pilih Tanggal
                                                        </span>
                                                    )}
                                                    <Calendar1 className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0 z-[10000]"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="end_at"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tanggal Akhir</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
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
                                                            Pilih Tanggal
                                                        </span>
                                                    )}
                                                    <Calendar1 className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0 z-[10000]"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_active"
                            className="w-full"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="mb-2">
                                        Status Aktif
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status aktif" />
                                        </SelectTrigger>
                                        <SelectContent className="px-2 bg-white overflow-y-auto z-[10000]">
                                            <SelectItem value="1">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="0">
                                                Nonaktif
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_published"
                            className="w-full"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="mb-2">
                                        Status Publish
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status publish" />
                                        </SelectTrigger>
                                        <SelectContent className="px-2 bg-white overflow-y-auto z-[10000]">
                                            <SelectItem value="1">
                                                Publish
                                            </SelectItem>
                                            <SelectItem value="0">
                                                Tidak Publish
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-row justify-between">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={onClose}
                            >
                                Batal
                            </Button>
                            <Button type="submit">
                                Ubah
                                <Edit className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Dialog>
    );
};

export default DialogEditPeriod;
