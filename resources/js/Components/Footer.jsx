import { Link } from "@inertiajs/react";
import { Email, Phone, WhatsApp } from "@mui/icons-material";
import React from "react";

export default function Footer() {
    return (
        <footer>
            <div className="py-12 md:py-16 bg-primary-foreground border-y-2 border-primary-foreground">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Top area: Blocks */}
                    <div className="grid md:grid-cols-12 gap-8 lg:gap-20 mb-8 md:mb-12">
                        {/* 1st block */}
                        <div className="md:col-span-4 lg:col-span-5">
                            <div className="mb-2 flex flex-row justify-center md:justify-start">
                                {/* Logo */}
                                <Link href="/">
                                    <img
                                        src="/images/logodpmptsp_blue.png"
                                        className="w-auto h-10"
                                    />
                                </Link>
                            </div>
                            <div className="text-gray-400">
                                Komplek Perkantoran PemKab Bekasi, Gedung B1
                            </div>
                            <div className="text-gray-400">
                                Jl. Deltamas Boulevard, Sukamahi, Cikarang
                                Pusat, Kabupaten Bekasi, Jawa Barat 17530
                            </div>
                        </div>

                        {/* 2nd, 3rd and 4th blocks */}
                        <div className="md:col-span-8 lg:col-span-7 grid">
                            {/* 2nd block */}
                            <div className="text-md flex flex-col md:flex-row gap-3 bg-primary rounded-lg items-center justify-around py-2 md:py-0">
                                <div className="flex flex-col items-center gap-2 text-primary-foreground">
                                    <Phone />
                                    <hr className="w-full border-primary-foreground" />
                                    (021) 123 456 789
                                </div>
                                <div className="flex flex-col items-center gap-2 text-primary-foreground">
                                    <Email />
                                    <hr className="w-full border-primary-foreground" />
                                    info@bekasikab.go.id
                                </div>
                                <div className="flex flex-col items-center gap-2 text-primary-foreground">
                                    <WhatsApp />
                                    <hr className="w-full border-primary-foreground" />
                                    08123 456 789
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom area */}
                    <div className="md:flex md:items-center md:justify-between">
                        {/* Copyrights note */}
                        <div className="text-gray-400 text-sm mr-4">
                            &copy; Kabupaten Bekasi
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
