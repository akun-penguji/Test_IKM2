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

export const serviceSchema = z.object({
    name: z.string().min(1, { message: "Anda belum mengisi nama layanan" }),
});

const DialogAddService = ({ onClose, open, id, data, isEdit }) => {
    const form = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: "",
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
            router.patch("/services/" + id, values);
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = (values) => {
        try {
            router.post("/services", values);
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (data && data.id) {
            Object.keys(data).map(
                (v) => data[v] != null && form.setValue(v, data[v].toString()),
            );
        }
    }, [data]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth>
            <DialogTitle className="font-bold">
                {isEdit ? "Ubah" : "Tambah"} Layanan
            </DialogTitle>
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
                                    <FormLabel>Nama Layanan</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nama Layanan"
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
                                {isEdit ? "Ubah" : "Tambah"}
                                <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Dialog>
    );
};

export default DialogAddService;
