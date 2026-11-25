import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head, Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-xl font-bold">Login Dashboard IKM</h1>
                <div className="flex flex-row gap-3">
                    <Link href="/">
                        <img
                            src="/images/logodpmptsp_final.png"
                            className="w-auto h-40"
                        />
                    </Link>
                </div>
            </div>
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <Head>
                    <link rel="icon" href="/images/logo.svg" />
                </Head>
                {children}
            </div>
        </div>
    );
}
