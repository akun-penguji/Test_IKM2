import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    ClipboardList,
    Command,
    FileSpreadsheet,
    FileText,
    Frame,
    GalleryVerticalEnd,
    LayoutDashboard,
    Map,
    PieChart,
    Settings,
    Settings2,
    SquareTerminal,
    FileArchive,
    Upload,
} from "lucide-react";

import { NavMain } from "@/Components/nav-main";
import { NavProjects } from "@/Components/nav-projects";
import { NavUser } from "@/Components/nav-user";
import { TeamSwitcher } from "@/Components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/Components/ui/sidebar";
import { AppLogo } from "./app-logo";

import { useEffect } from "react";
import { Collapsible } from "@radix-ui/react-collapsible";

// This is sample data.
const data = {
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

export function AppSidebar({ ...props }) {
    const { state, open } = useSidebar();
    const getNavItems = () => {
        if (!props.user) {
            return [
                {
                    title: "Portal",
                    url: route("portal.index"),
                    icon: LayoutDashboard,
                    isActive: route().current("portal.index"),
                },
                {
                    title: "Isi Survey",
                    url: route("survey.guest.index"),
                    icon: FileText,
                    isActive: route().current("survey.guest.index"),
                },
            ];
        }

        const navItems = [
            {
                title: "Dashboard",
                url: route("dashboard"),
                icon: LayoutDashboard,
                isActive: route().current("dashboard"),
            },
            {
                title: "Perhitungan IKM",
                url: "#",
                icon: FileSpreadsheet,
                isActive:
                    route().current("periods.index") ||
                    route().current("rtl.index") ||
                    route().current("table.calculate"),
                items: [
                    ...(props.user.roleId === 1
                        ? [
                              {
                                  title: "Penentuan Periode",
                                  url: route("periods.index"),
                                  isActive: route().current("periods.index"),
                              },
                          ]
                        : []),
                    {
                        title: "Tabel IKM",
                        url: route("table.calculate"),
                        isActive: route().current("table.calculate"),
                    },
                    {
                        title: "Rencana Tindak Lanjut",
                        url: route("rtl.index"),
                        isActive: route().current("rtl.index"),
                    },
                ],
            },
            {
                title: "Isi Survey",
                url: route("survey.guest.index"),
                icon: FileText,
                isActive: route().current("survey.guest.index"),
            },
            {
                title: "Data Survey",
                url: route("survey.index"),
                icon: ClipboardList,
                isActive: route().current("survey.index"),
            },
            {
                title: "Laporan Survey",
                url: "#",
                icon: FileArchive,
                isActive:
                    route().current("report.index") ||
                    route().current("survey-reports.create") ||
                    route().current("survey-reports.gallery") ||
                    route().current("survey-reports.show"),
                items: [
                    {
                        title: "Rekap IKM",
                        url: route("report.index"),
                        isActive: route().current("report.index"),
                    },
                    {
                        title: "Upload Laporan",
                        url: route("survey-reports.create"),
                        isActive: route().current("survey-reports.create"),
                    },
                    {
                        title: "Laporan Diupload",
                        url: route("survey-reports.gallery"),
                        isActive: route().current("survey-reports.gallery"),
                    },
                ],
            },
        ];

        // Add Settings menu for admin users
        if (props.user.roleId === 1) {
            navItems.push({
                title: "Pengaturan",
                url: "#",
                icon: Settings,
                isActive:
                    route().current("settings.user") ||
                    route().current("questions.index") ||
                    route().current("services.index") ||
                    route().current("lokus.index"),
                items: [
                    {
                        title: "Pengguna",
                        url: route("settings.user"),
                        isActive: route().current("settings.user"),
                    },
                    {
                        title: "Pertanyaan",
                        url: route("questions.index"),
                        isActive: route().current("questions.index"),
                    },
                    {
                        title: "Layanan",
                        url: route("services.index"),
                        isActive: route().current("services.index"),
                    },
                    {
                        title: "Lokus",
                        url: route("lokus.index"),
                        isActive: route().current("lokus.index"),
                    },
                    {
                        title: "Upload Laporan",
                        url: route("survey-reports.create"),
                        isActive: route().current("survey-reports.create"),
                    },
                ],
            });
        }

        return navItems;
    };

    useEffect(() => {
        if (props.user) {
            props.user.avatar = "/images/logodpmptsp_final.png";
        }
    }, []);

    return (
        <Sidebar collapsible="icon" {...props}>
            <AppLogo />
            {open && (
                <SidebarGroup className="bg-primary">
                    <SidebarMenu>
                        <Collapsible
                            key="app-title"
                            asChild
                            className="group/collapsible"
                        >
                            <SidebarMenuItem className="flex justify-center">
                                <div>
                                    <span className="font-semibold text-lg text-white">
                                        IKM DPMPTSP APP
                                    </span>
                                </div>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>
            )}
            <SidebarContent className="bg-primary text-white">
                <NavMain items={getNavItems()} />
            </SidebarContent>
            {props.user && (
                <SidebarFooter className="bg-primary text-white">
                    <NavUser user={props.user} />
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    );
}
