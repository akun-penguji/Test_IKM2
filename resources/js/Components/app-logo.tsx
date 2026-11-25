import * as React from "react";
import { Link } from "@inertiajs/react";
import { BarChart2, LayoutDashboard } from "lucide-react"; // Using BarChart2 as a placeholder icon
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
} from "@/Components/ui/sidebar";
import { Collapsible } from "@/Components/ui/collapsible";
import { useSidebar } from "@/Components/ui/sidebar";

interface AppLogoProps {
    collapsed?: boolean;
}

export function AppLogo({ collapsed = false }: AppLogoProps) {
    const { state, open } = useSidebar();
    return (
        <SidebarGroup className="bg-primary">
            <SidebarMenu>
                <Collapsible
                    key="app-logo"
                    asChild
                    className="group/collapsible"
                >
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="hover:bg-primary">
                            <Link href="/" className="flex justify-center">
                                <img
                                    src={
                                        open
                                            ? "/images/logodpmptsp.png"
                                            : "/images/logo.png"
                                    }
                                    className={
                                        open ? "w-auto h-8" : "w-8 h-auto"
                                    }
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    );
}
