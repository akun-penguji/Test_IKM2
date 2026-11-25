import { router } from "@inertiajs/react";
import { Edit, Send } from "@mui/icons-material";
import { Dialog, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { zodResolver } from "@hookform/resolvers/zod";

export const questionSchema = z.object({
    name: z.string().min(1, { message: "Anda belum mengisi pertanyaan" }),
    answer1: z
        .string()
        .min(1, { message: "Anda belum mengisi jawaban bobot 1" }),
    answer2: z
        .string()
        .min(1, { message: "Anda belum mengisi jawaban bobot 2" }),
    answer3: z
        .string()
        .min(1, { message: "Anda belum mengisi jawaban bobot 3" }),
    answer4: z
        .string()
        .min(1, { message: "Anda belum mengisi jawaban bobot 4" }),
});

const DialogEditQuestion = ({ onClose, open, id, data }) => {
    const form = useForm({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            name: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
        },
    });

    const handleSubmit = (values) => {
        try {
            router.patch("/questions/" + id, values);
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (data && data.id) {
            form.setValue("name", data.name);
            data.answers.forEach((v) => {
                form.setValue(`answer${v.value}`, v.name);
            });
        }
    }, [data]);

    return (
        <Dialog onClose={onClose} open={open} fullWidth>
            <DialogTitle className="font-bold">Ubah Pertanyaan</DialogTitle>
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
                                    <FormLabel>Isi Pertanyaan</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Isi Pertanyaan"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer4"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jawaban bobot 4</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Jawaban bobot 4"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer3"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jawaban bobot 3</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Jawaban bobot 3"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jawaban bobot 2</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Jawaban bobot 2"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jawaban bobot 1</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Jawaban bobot 1"
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

export default DialogEditQuestion;
