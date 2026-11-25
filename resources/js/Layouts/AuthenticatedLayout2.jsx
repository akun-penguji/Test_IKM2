import Dropdown from "@/Components/Dropdown";
import Footer from "@/Components/Footer";
import NavDropdown from "@/Components/NavDropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
import { useState } from "react";

export default function Authenticated2({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-white">
            <nav className="bg-primary border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <img
                                        src="/images/logodpmptsp_final.png"
                                        className="w-auto h-10"
                                    />
                                </Link>
                            </div>
                            {user ? (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex ">
                                    <NavLink
                                        href={route("dashboard")}
                                        active={route().current("dashboard")}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavDropdown
                                        active={
                                            route().current("periods.index") ||
                                            route().current("rtl.index") ||
                                            route().current("table.calculate")
                                        }
                                    >
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white hover:text-white hover:font-bold focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        Perhitungan IKM
                                                        <svg
                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                {user.roleId === 1 && (
                                                    <Dropdown.Link
                                                        href={route(
                                                            "periods.index",
                                                        )}
                                                        method="get"
                                                        as="button"
                                                    >
                                                        Penentuan Periode
                                                    </Dropdown.Link>
                                                )}
                                                <Dropdown.Link
                                                    href={route(
                                                        "table.calculate",
                                                    )}
                                                    method="get"
                                                    as="button"
                                                >
                                                    Tabel IKM
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("rtl.index")}
                                                    method="get"
                                                    as="button"
                                                >
                                                    Rencana Tindak Lanjut
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </NavDropdown>
                                    <NavLink
                                        href={route("survey.guest.index")}
                                        active={route().current(
                                            "survey.guest.index",
                                        )}
                                    >
                                        Isi Survey
                                    </NavLink>
                                    <NavLink
                                        href={route("survey.index")}
                                        active={route().current("survey.index")}
                                    >
                                        Data Survey
                                    </NavLink>
                                    <NavDropdown
                                        active={
                                            route().current("settings.user") ||
                                            route().current(
                                                "questions.index",
                                            ) ||
                                            route().current("services.index") ||
                                            route().current("lokus.index")
                                        }
                                    >
                                        {user.roleId === 1 && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md font-medium text-white hover:text-white hover:font-bold focus:outline-none transition ease-in-out duration-150"
                                                        >
                                                            Pengaturan
                                                            <svg
                                                                className="ms-2 -me-0.5 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "settings.user",
                                                        )}
                                                        method="get"
                                                        as="button"
                                                    >
                                                        Pengguna
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "questions.index",
                                                        )}
                                                        method="get"
                                                        as="button"
                                                    >
                                                        Pertanyaan
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "services.index",
                                                        )}
                                                        method="get"
                                                        as="button"
                                                    >
                                                        Layanan
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            "lokus.index",
                                                        )}
                                                        method="get"
                                                        as="button"
                                                    >
                                                        Lokus
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        )}
                                    </NavDropdown>
                                </div>
                            ) : (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("portal.index")}
                                        active={route().current("portal.index")}
                                    >
                                        Portal
                                    </NavLink>
                                    <NavLink
                                        href={route("survey.guest.index")}
                                        active={route().current(
                                            "survey.guest.index",
                                        )}
                                    >
                                        Isi Survey
                                    </NavLink>
                                    <NavLink
                                        href={route("survey-reports.gallery")}
                                        active={route().current(
                                            "survey-reports.gallery",
                                        )}
                                    >
                                        Laporan Survey IKM
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 relative">
                                    <Link
                                        href={route("login")}
                                        className="font-normal text-white hover:font-bold dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                    >
                                        Log In
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    {user ? (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                    ) : (
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("portal.index")}
                                active={route().current("portal.index")}
                            >
                                Portal
                            </ResponsiveNavLink>
                        </div>
                    )}

                    {user ? (
                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800">
                                    {user.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {user.username}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("login")}>
                                    Login
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {header && (
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center md:text-start">
                    {header}
                </div>
            )}

            <Head>
                <link rel="icon" href="/images/logodpmptsp_final.png" />
            </Head>
            <main>{children}</main>
            <Footer />
        </div>
    );
}
