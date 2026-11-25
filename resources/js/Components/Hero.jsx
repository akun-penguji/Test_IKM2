import { Typography } from "@mui/material";
import Threads from "./Threads";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white min-h-[500px] flex items-center">
            {/* Full-width Background Shape with Gradient */}
            <div className="absolute inset-0 z-0 -mt-0.5">
                <svg
                    viewBox="0 0 300 200"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Gradient definition
                          y1="0" y2="1" sets the gradient to flow vertically
                          from top (0%) to bottom (100%)
                        */}
                        <linearGradient
                            id="shapeGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >
                            <stop offset="0%" stopColor="#109cdb" />{" "}
                            {/* Light blue top */}
                            <stop offset="100%" stopColor="#0c5b86" />{" "}
                            {/* Darker blue bottom */}
                        </linearGradient>
                    </defs>

                    <path
                        d="M 0,0
                           L 300,0
                           L 300,170
                           C 225,140 150,140 75,170
                           C 40,185 20,185 0,170
                           Z"
                        fill="url(#shapeGradient)" // Applied the gradient
                        stroke="none" // Border removed
                    />
                </svg>
            </div>

            {/* Content Layer */}
            {/* Changed text color to 'text-white' to ensure readability
               against the new, darker gradient background. Added drop-shadow
               to content for better contrast.
            */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
                <div className="relative pt-10 pb-20 md:pt-16 md:pb-24 drop-shadow-lg">
                    {/* Logo Section */}
                    <div className="flex flex-col mx-auto text-center pb-12 justify-center items-center gap-3">
                        <img
                            src="/images/logodpmptsp_blue.png"
                            className="w-auto h-24" // Inverted the logo to white
                            alt="Logo DPMPTSP"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="flex flex-col mx-auto text-center justify-center items-center">
                        <div className="mb-4 xl:text-5xl md:text-3xl text-xl flex flex-col font-extrabold text-white text-shadow-xl">
                            <span>Aplikasi Indeks Kepuasan Masyarakat</span>
                            <span>DPMPTSP</span>
                            <span>Kabupaten Bekasi</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
