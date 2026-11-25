import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { createTheme, ThemeProvider } from "@mui/material";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const theme = createTheme({
    palette: {
        background: {
            paper: "hsl(var(--background))",
            default: "hsl(var(--background))",
        },
        text: {
            primary: "hsl(var(--foreground))",
            secondary: "hsl(var(--muted-foreground))",
        },
        primary: {
            main: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
            main: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
            main: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
            main: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
            main: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
        },
    },
    shape: {
        borderRadius: "var(--radius)",
    },
});
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const appWithcomponent = (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <ToastContainer />
                <ThemeProvider theme={theme}>
                    <App {...props} />
                </ThemeProvider>
            </LocalizationProvider>
        );

        root.render(appWithcomponent);
    },
    progress: {
        color: "#4B5563",
    },
});
