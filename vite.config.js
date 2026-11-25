import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

const copyPdfWorker = () => {
    return {
        name: "copy-pdf-worker",
        closeBundle() {
            const publicDir = resolve("public");
            const destFile = resolve(publicDir, "pdf.worker.min.mjs");

            if (!existsSync(publicDir)) {
                mkdirSync(publicDir, { recursive: true });
            }

            const workerFile = resolve("node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
            if (existsSync(workerFile)) {
                copyFileSync(workerFile, destFile);
                console.log("Copied pdf.worker.min.mjs to public/");
            }
        },
    };
};

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
        copyPdfWorker(),
    ],
    server: {
        host: "0.0.0.0",
        port: 5173,
        proxy: {
            "^/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            "^/storage": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            "^/pdf.worker.min.mjs": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
        },
    },
});