'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/usuarios";

export default function AdjustmentsPage() {
    const router = useRouter();

    // Estado inicial diferido para evitar ejecuciones innecesarias en cada render
    const [user, setUser] = useState(() => getCurrentUser());

    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        email: user?.email || '',
    });

    const [notifications, setNotifications] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    const handleLogout = () => {
        logout();
        setUser(null);
        router.push("/login");
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes integrar la llamada a la API para actualizar los datos
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="flex-1 flex flex-col gap-8 w-full max-w-7xl p-6 md:p-8 text-slate-800 dark:text-slate-100">
            {/* Encabezado */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Administra la configuración de tu cuenta y las preferencias del sistema.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna Izquierda: Tarjeta de Perfil & Sesión */}
                <div className="md:col-span-1 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold mb-4 border-2 border-indigo-500/20">
                            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="text-lg font-semibold">{user?.nombre || "Usuario"}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                            {user?.email || "sin-email@dominio.com"}
                        </p>
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full">
                            Rol ID: {user?.rol_id ?? "N/A"}
                        </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-1">Sesión</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Cierra sesión en este dispositivo para proteger tu cuenta.
                        </p>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm rounded-lg border border-red-200 transition-colors dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-300 dark:border-red-800"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>

                {/* Columna Derecha: Formularios de Edición y Preferencias */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    {/* Datos Personales */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Información del Perfil</h3>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                {isSaved ? (
                                    <span className="text-xs text-emerald-600 font-medium">¡Cambios guardados!</span>
                                ) : <span />}
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preferencias */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Preferencias de Sistema</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Notificaciones por correo</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Recibe alertas sobre cambios en la cuenta.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNotifications(!notifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}