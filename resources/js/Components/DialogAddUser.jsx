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
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { Send } from "@mui/icons-material";
import { Dialog, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, { message: "Anda belum mengisi nama" }),
    username: z
        .string()
        .min(1, { message: "Anda belum mengisi username" })
        .refine((val) => val === val.toLowerCase(), {
            message: "Username tidak boleh memiliki huruf kapital",
        }),
    roleId: z.string().min(1, { message: "Anda belum mengisi role" }),
    id_service: z.string().nullable(),
});

const DialogAddUser = ({ onClose, open, id, data, isEdit }) => {
    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            username: "",
            roleId: "",
            id_service: null,
        },
    });

    const [roleList, setRoleList] = useState([]);
    const [serviceList, setServiceList] = useState([]);

    const handleSubmit = (values) => {
        values.roleId = parseInt(values.roleId);
        if (values.id_service != null) {
            values.id_service = parseInt(values.id_service);
        }
        const newValues = {
            ...values,
            password: values.username,
        };
        if (values.roleId !== 2) {
            values.id_service = null;
        }
        if (isEdit === true) {
            handleEdit(newValues);
        } else {
            handleAdd(newValues);
        }
    };

    const handleEdit = (values) => {
        try {
            router.patch("/users/setting/" + id, values);
            form.reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = (values) => {
        try {
            router.post("/users/setting", values);
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

    useEffect(() => {
        const fetchRole = async () => {
            const response = await axios.get("/role-list");
            setRoleList(response.data);
        };

        const fetchService = async () => {
            const response = await axios.get("/service-list");
            setServiceList(response.data);
        };

        fetchRole();
        fetchService();
    }, []);

    return (
        <Dialog onClose={onClose} open={open} fullWidth>
            <DialogTitle className="font-bold">
                {isEdit ? "Ubah" : "Tambah"} Pengguna
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
                                    <FormLabel>Nama Pengguna</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nama Pengguna"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="roleId"
                            className="w-full"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="mb-2">Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent className="px-2 bg-white overflow-y-auto z-[10000]">
                                            {roleList.map((role) => (
                                                <SelectItem
                                                    key={role.id.toString()}
                                                    value={role.id.toString()}
                                                >
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="id_service"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Layanan</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value || ""}
                                        disabled={
                                            form.getValues("roleId") != 2 ||
                                            form.getValues("roleId") != "2"
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Layanan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-[10000]">
                                            {serviceList.map((service) => (
                                                <SelectItem
                                                    key={service.id}
                                                    value={String(service.id)}
                                                >
                                                    {service.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

export default DialogAddUser;
