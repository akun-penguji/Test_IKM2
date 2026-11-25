import React from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AuthenticatedLayout2 from "@/Layouts/AuthenticatedLayout2";

export default function ConditionalLayout({ children, header }) {
    const { auth } = usePage().props;

    // Check if user is authenticated
    const isAuthenticated = auth && auth.user;

    // Render the appropriate layout based on authentication status
    if (isAuthenticated) {
        return (
            <AuthenticatedLayout user={auth.user} header={header}>
                {children}
            </AuthenticatedLayout>
        );
    } else {
        return (
            <AuthenticatedLayout2 user={auth.user} header={header}>
                {children}
            </AuthenticatedLayout2>
        );
    }
}
