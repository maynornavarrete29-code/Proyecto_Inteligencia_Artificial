"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [reportesOpen, setReportesOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const reportSublinks = [
        { name: "Clientes Leales", href: "/bd/reportes/clientes-leales", icon: "notes" },
    ];

    const navLinks = [
        { name: "Panel", href: "/bd/dashboard", icon: "dashboard", subtitle: "Visión general de operaciones" },
        { name: "Proyectos", href: "/bd/proyectos", icon: "folder", subtitle: "Estado e historial de proyectos" },
        { name: "Tareas", href: "/bd/tareas", icon: "task_alt", subtitle: "Gestión de tareas y pendientes" },
        { name: "Clientes", href: "/bd/clientes", icon: "group", subtitle: "Perfiles de clientes e historial" },
        { name: "Mantenimiento", href: "/bd/mantenimiento", icon: "build", subtitle: "Gestión de soporte y mantenimiento" },
        { name: "Usuarios", href: "/bd/usuarios", icon: "person", subtitle: "Gestión de usuarios" },
        { name: "Reportes", href: "/bd/reportes", icon: "bar_chart", subtitle: "Análisis y reportes de desempeño", isDropdown: true },
    ];

    const isActive = (path: string) => {
        if (path === "/bd") return pathname === "/bd";
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
            setReportesOpen(false);
        }
    };

    return (
        <div className="bg-[#050811] text-slate-200 min-h-screen selection:bg-[#efc704]/30 selection:text-[#efc704]">

            {/* SIDEBAR NAVEGACIÓN */}
            <aside
                className={`fixed left-0 top-0 h-full z-50 bg-[#0a0f19] border-r border-white/10 flex flex-col p-3 gap-2 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                    }`}
            >
                {/* Botón flotante para colapsar */}
                <button
                    type="button"
                    onClick={handleToggleCollapse}
                    className="absolute top-6 -right-3.5 bg-[#0a0f19] border border-white/20 hover:border-[#efc704] text-slate-300 hover:text-[#efc704] rounded-full w-7 h-7 flex items-center justify-center shadow-lg cursor-pointer z-50 transition-all active:scale-95"
                    title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                >
                    <span className="material-symbols-outlined text-[16px]">
                        {isCollapsed ? "chevron_right" : "chevron_left"}
                    </span>
                </button>

                {/* LOGO & BRANDING */}
                <div className="pt-3 pb-6 border-b border-white/10 mb-2 transition-all duration-300">
                    <div className="flex items-center justify-center">
                        {isCollapsed ? (
                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704] font-mono font-bold text-lg shadow-sm">
                                B
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-in fade-in duration-200">
                                <span className="text-[10px] font-mono tracking-widest text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2.5 py-0.5 rounded-full font-bold uppercase mb-1">
                                    BeyonDev
                                </span>
                                <h1 className="text-lg font-bold text-white tracking-tight">
                                    Systems Portal
                                </h1>
                            </div>
                        )}
                    </div>
                </div>

                {/* ENLACES DE NAVEGACIÓN */}
                <nav className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
                    {navLinks.map((link) => (
                        <div key={link.href}>
                            {link.isDropdown ? (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => !isCollapsed && setReportesOpen(!reportesOpen)}
                                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 text-xs font-medium ${reportesOpen || isActive(link.href)
                                            ? "bg-[#efc704]/10 text-[#efc704] font-semibold"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                            } ${isCollapsed ? "justify-center px-0" : "gap-3"}`}
                                        title={isCollapsed ? link.name : undefined}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[20px] shrink-0">
                                                {link.icon}
                                            </span>
                                            {!isCollapsed && <span>{link.name}</span>}
                                        </div>
                                        {!isCollapsed && (
                                            <span
                                                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${reportesOpen ? "rotate-180 text-[#efc704]" : "text-slate-500"
                                                    }`}
                                            >
                                                expand_more
                                            </span>
                                        )}
                                    </button>

                                    {/* SUBMENÚ REPORTES */}
                                    {reportesOpen && !isCollapsed && (
                                        <div className="flex flex-col gap-1 mt-1 pl-3 border-l border-white/10 ml-4 animate-in fade-in duration-150">
                                            {reportSublinks.map((sublink) => (
                                                <Link
                                                    key={sublink.href}
                                                    href={sublink.href}
                                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 ${isActive(sublink.href)
                                                        ? "bg-[#efc704]/15 text-[#efc704] font-semibold"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-[16px] shrink-0">
                                                        {sublink.icon}
                                                    </span>
                                                    <span className="truncate">{sublink.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={`flex items-center p-2.5 rounded-xl transition-all duration-200 text-xs font-medium ${isActive(link.href)
                                        ? "bg-[#efc704]/10 text-[#efc704] border-l-2 border-[#efc704] font-semibold shadow-sm"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                        } ${isCollapsed ? "justify-center border-none px-0" : "gap-3"}`}
                                    title={isCollapsed ? link.name : undefined}
                                >
                                    <span className="material-symbols-outlined text-[20px] shrink-0">
                                        {link.icon}
                                    </span>
                                    {!isCollapsed && <span>{link.name}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* AJUSTES Y LOGOUT */}
                <div className="mt-auto border-t border-white/10 pt-3 flex flex-col gap-1">
                    <Link
                        href="/bd/ajustas"
                        className={`flex items-center p-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-xl text-xs font-medium ${isCollapsed ? "justify-center px-0" : "gap-3"
                            }`}
                        title={isCollapsed ? "Ajustes" : undefined}
                    >
                        <span className="material-symbols-outlined text-[20px] shrink-0">settings</span>
                        {!isCollapsed && <span>Ajustes</span>}
                    </Link>

                    <button
                        type="button"
                        onClick={() => router.push("/auth")}
                        className={`flex items-center w-full p-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all rounded-xl text-xs font-medium ${isCollapsed ? "justify-center px-0" : "gap-3"
                            }`}
                        title={isCollapsed ? "Cerrar sesión" : undefined}
                    >
                        <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
                        {!isCollapsed && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main
                className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? "ml-0" : "ml-0"
                    }`}
            >
                {children}
            </main>
        </div>
    );
}