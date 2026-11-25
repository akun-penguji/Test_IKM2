// @ts-nocheck

import { ChevronRight, ChevronDown, type LucideIcon } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/Components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
            isActive?: boolean;
        }[];
    }[];
}) {
    const { state } = useSidebar();
    const isExpanded = state === "expanded";

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        {item.items ? (
                            <SidebarMenuItem>
                                {isExpanded ? (
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            className={
                                                item.isActive
                                                    ? "bg-white text-black"
                                                    : ""
                                            }
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                className={
                                                    item.isActive
                                                        ? "bg-white text-black"
                                                        : ""
                                                }
                                            >
                                                {item.icon && <item.icon />}
                                                <ChevronDown className="ml-auto size-4" />
                                            </SidebarMenuButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            side="right"
                                            align="start"
                                            sideOffset={8}
                                        >
                                            <DropdownMenuItem
                                                className="font-semibold"
                                                disabled
                                            >
                                                {item.title}
                                            </DropdownMenuItem>
                                            {item.items.map((subItem) => (
                                                <DropdownMenuItem
                                                    key={subItem.title}
                                                >
                                                    <Link
                                                        href={subItem.url}
                                                        className={`w-full ${
                                                            subItem.isActive
                                                                ? "font-semibold"
                                                                : ""
                                                        }`}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                {isExpanded && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={
                                                            subItem.isActive
                                                                ? "bg-white text-black"
                                                                : "text-white"
                                                        }
                                                    >
                                                        <Link
                                                            href={subItem.url}
                                                            active={
                                                                subItem.isActive
                                                            }
                                                        >
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        ) : (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    asChild
                                    className={
                                        item.isActive
                                            ? "bg-white text-black"
                                            : ""
                                    }
                                >
                                    <Link
                                        href={item.url}
                                        active={item.isActive}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
