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
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { Send } from "@mui/icons-material";
import { Dialog, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const rtlSchema = z.object({
    saran: z.string().min(1, { message: "Anda belum mengisi keluhan / saran" }),
    program: z.string().min(1, { message: "Anda belum mengisi program" }),
    pj: z.string().min(1, { message: "Anda belum mengisi penanggungjawab" }),
});

const DialogAddRTL = ({
    onClose,
    open,
    id,
    data,
    isEdit,
    listUnsur,
    periodId,
}) => {
    const form = useForm({
        resolver: zodResolver(rtlSchema),
        defaultValues: {
            saran: "",
            program: "",
            pj: "",
        },
    });

    const handleSubmit = (values) => {
        if (isEdit === true) {
            handleEdit(values);
        } else {
            handleAdd(values);
        }
    };

    const handleEdit = (values) => {
        try {
            router.patch("/rtl/" + id, values);
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = (values) => {
        try {
            router.post("/rtl", values);
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (data && data.id) {
            Object.keys(data).map(
                (v) => data[v] != null && form.setValue(v, data[v]),
            );
        }
    }, [data]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth>
            <DialogTitle className="font-bold">
                {isEdit ? "Isi" : "Tambah"} Rencana Tindak Lanjut
            </DialogTitle>
            {data && (
                <div className="text-center">
                    <p>Unsur: {data.unsur.name}</p>
                </div>
            )}
            <div className="px-6 pb-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="saran"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keluhan / Saran</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Keluhan / Saran"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="program"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Program / Kegiatan</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Program / Kegiatan"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pj"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Penanggungjawab</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Penanggungjawab"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
                                {isEdit ? "Isi" : "Tambah"}
                                <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Dialog>
    );
};

export default DialogAddRTL;
