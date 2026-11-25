import Chart from "@/Components/Chart";
import Hero from "@/Components/Hero2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AuthenticatedLayout2 from "@/Layouts/AuthenticatedLayout2";
import QuickActions from "@/Components/QuickActions";
import QuestionnaireCard from "@/Components/QuestionnaireCard";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Portal({ auth, period }) {
    if (auth.user) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Portal" />
                <div className="min-h-screen">
                    <div className="relative">
                        <Hero period={period} />
                    </div>
                    <div className="px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                        <div className="mx-2 lg:mx-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    {!period ? (
                                        <div className="col-span-1 lg:col-span-2 text-center space-y-4 py-8">
                                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                                <svg
                                                    className="w-12 h-12 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-lg text-gray-500">
                                                Belum ada data periode
                                            </p>
                                        </div>
                                    ) : (
                                        <Chart period={period} />
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <QuickActions />
                                    <QuestionnaireCard />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    } else {
        return (
            <AuthenticatedLayout2 user={auth.user}>
                <Head title="Portal" />
                <div className="min-h-screen">
                    <div className="relative">
                        <Hero period={period} />
                    </div>
                    <div className="px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                        <div className="mx-2 lg:mx-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    {!period ? (
                                        <div className="col-span-1 lg:col-span-2 text-center space-y-4 py-8">
                                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                                <svg
                                                    className="w-12 h-12 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-lg text-gray-500">
                                                Belum ada data periode
                                            </p>
                                        </div>
                                    ) : (
                                        <Chart period={period} />
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <QuickActions />
                                    <QuestionnaireCard />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout2>
        );
    }
}
