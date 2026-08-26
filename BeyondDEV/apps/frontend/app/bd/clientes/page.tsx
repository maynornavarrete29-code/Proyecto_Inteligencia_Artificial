'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/ui/header';
import { useClientes, createCliente, Cliente } from '@/lib/clientes';

export default function ClientesPage() {
    //const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [sectorFilter, setSectorFilter] = useState('TODOS');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Cliente>>({});

    const { data: clientes, loading, error, refetch } = useClientes();

    // Filtrado de clientes
    const filteredClientes = useMemo(() => {
        return clientes?.filter((c) => {
            const matchesSearch =
                c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.sector?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'TODOS' || c.estado === statusFilter;
            const matchesSector = sectorFilter === 'TODOS' || c.sector === sectorFilter;

            return matchesSearch && matchesStatus && matchesSector;
        });
    }, [clientes, searchTerm, statusFilter, sectorFilter]);

    // Obtener lista única de sectores para el filtro
    const sectoresDisponibles = useMemo(() => {
        const sectors = clientes?.map((c) => c.sector).filter(Boolean) as string[];
        return Array.from(new Set(sectors));
    }, [clientes]);

    // Métricas KPI
    const stats = useMemo(() => {
        const total = clientes?.length;
        const activos = clientes?.filter((c) => c.estado === 'Activo').length;
        const prospectos = clientes?.filter((c) => c.estado === 'Prospecto').length;
        const inversionTotal = clientes?.reduce((acc, c) => acc + (c.total_invertido || 0), 0);

        return { total, activos, prospectos, inversionTotal };
    }, [clientes]);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditingCliente(null);
        setFormData({
            nombre: '',
            email: '',
            telefono: '',
            documento: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (cliente: Cliente) => {
        setEditingCliente(cliente);
        setFormData({ ...cliente });
        setIsModalOpen(true);
    };
    const handleSaveCliente = async (e: React.FormEvent) => {
        console.log(formData);
        const newClient = await createCliente(formData);

        if (newClient) {
            console.log("Cliente Registrado con exito!");
            setIsModalOpen(false);
        }
        else
            console.log("Error al registrar el cliente")
    };

    const handleDeleteCliente = (id: number) => {
        /*
            setClientes((prev) => prev.filter((c) => c.cliente_id !== id));
            setDeleteConfirmId(null);
            */
    };
    // Badges estilizados
    const getStatusBadge = (estado?: string) => {
        switch (estado) {
            case 'Activo':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'Prospecto':
                return 'bg-[#efc704]/10 text-[#efc704] border-[#efc704]/30';
            case 'Inactivo':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="lg:ml-[280px] lg:mt-[30px] flex-1 flex flex-col min-w-0 bg-[#050811] text-slate-200 p-4 sm:p-6 lg:p-8 min-h-screen">
            <Header title="Gestión de Clientes" subtitle="Perfiles de clientes, historial de facturación y directorio de contactos" />

            <div className="flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto">

                {/* KPI CARDS METRICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Clientes</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704]">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Empresas e individuos en la base de datos</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Clientes Activos</p>
                                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.activos}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Con contratos o proyectos vigentes</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Prospectos</p>
                                <h3 className="text-2xl font-bold text-[#efc704] mt-1">{stats.prospectos}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704]">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">En fase de propuesta o negociación</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Inversión Total</p>
                                <h3 className="text-2xl font-bold text-sky-400 mt-1">
                                    ${stats.inversionTotal?.toLocaleString('en-US')}
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Facturación acumulada histórica</p>
                    </div>
                </div>

                {/* BARRA DE FILTROS Y CONTROLES */}
                <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Búsqueda */}
                    <div className="relative w-full md:w-72">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por cliente, empresa o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704] transition-all"
                        />
                    </div>

                    {/* Filtros Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#0a0f19] border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-[#efc704]"
                        >
                            <option value="TODOS">Todos los Estados</option>
                            <option value="Activo">Activo</option>
                            <option value="Prospecto">Prospecto</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>

                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="bg-[#0a0f19] border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-[#efc704]"
                        >
                            <option value="TODOS">Todos los Sectores</option>
                            {sectoresDisponibles.map((sector) => (
                                <option key={sector} value={sector}>
                                    {sector}
                                </option>
                            ))}
                        </select>

                        {/* Toggle de Vista */}
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5 ml-auto md:ml-0">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-[#efc704] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                                    }`}
                                title="Vista Cuadrícula"
                            >
                                <span className="material-symbols-outlined text-sm block">grid_view</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'table' ? 'bg-[#efc704] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                                    }`}
                                title="Vista Tabla"
                            >
                                <span className="material-symbols-outlined text-sm block">format_list_bulleted</span>
                            </button>
                        </div>

                        {/* CTA Nuevo Cliente */}
                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="px-4 py-2 bg-[#efc704] text-slate-950 font-bold text-xs rounded-xl hover:bg-[#d8b303] shadow-lg shadow-[#efc704]/20 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">person_add</span>
                            Nuevo Cliente
                        </button>
                    </div>
                </div>

                {/* LISTADO DE CLIENTES */}
                {filteredClientes?.length === 0 ? (
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">person_off</span>
                        <p className="text-white font-semibold">No se encontraron clientes</p>
                        <p className="text-xs text-slate-400 mt-1">Intenta ajustando los filtros o el término de búsqueda.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* VISTA EN GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredClientes?.map((c) => (
                            <div
                                key={c.cliente_id}
                                className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 hover:border-[#efc704]/50 transition-all flex flex-col justify-between group shadow-lg"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704] font-bold text-base">
                                                {c.empresa ? c.empresa.charAt(0).toUpperCase() : 'C'}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-white group-hover:text-[#efc704] transition-colors line-clamp-1">
                                                    {c.empresa || c.nombre}
                                                </h4>
                                                <p className="text-xs text-slate-400 line-clamp-1">{c.nombre}</p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                                c.estado
                                            )}`}
                                        >
                                            {c.estado}
                                        </span>
                                    </div>

                                    {/* Detalle Contacto */}
                                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <span className="material-symbols-outlined text-sm text-slate-500">mail</span>
                                            <span className="truncate">{c.email || 'Sin correo'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <span className="material-symbols-outlined text-sm text-slate-500">call</span>
                                            <span>{c.telefono || 'Sin teléfono'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <span className="material-symbols-outlined text-sm text-slate-500">domain</span>
                                            <span className="truncate">{c.sector || 'General'}</span>
                                        </div>
                                    </div>

                                    {/* Resumen Financiero y Proyectos */}
                                    <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-slate-400 block uppercase font-mono">Proyectos</span>
                                            <span className="text-white font-bold">{c.proyectos_activos || 0} Activos</span>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-slate-400 block uppercase font-mono">Inversión</span>
                                            <span className="text-[#efc704] font-bold">${c.total_invertido?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-5">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCliente(c)}
                                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span> Perfil
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(c)}
                                            className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-base">edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmId(c.cliente_id!)}
                                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                            title="Eliminar"
                                        >
                                            <span className="material-symbols-outlined text-base">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* VISTA EN TABLA */
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400 uppercase bg-white/5">
                                        <th className="p-4">Empresa / Cliente</th>
                                        <th className="p-4">Contacto</th>
                                        <th className="p-4">Sector</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4">Proyectos</th>
                                        <th className="p-4">Inversión Total</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    {filteredClientes?.map((c) => (
                                        <tr key={c.cliente_id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-semibold text-white">
                                                <div>{c.empresa || c.nombre}</div>
                                                <span className="text-[10px] text-slate-500 font-normal">{c.nombre}</span>
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                <div>{c.email}</div>
                                                <span className="text-[10px] text-slate-500">{c.telefono}</span>
                                            </td>
                                            <td className="p-4 text-slate-300">{c.sector || 'N/A'}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(c.estado)}`}>
                                                    {c.estado}
                                                </span>
                                            </td>
                                            <td className="p-4 text-white font-medium">{c.proyectos_activos || 0}</td>
                                            <td className="p-4 text-[#efc704] font-bold">${c.total_invertido?.toLocaleString()}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedCliente(c)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        title="Ver Perfil"
                                                    >
                                                        <span className="material-symbols-outlined text-base">visibility</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(c)}
                                                        className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-base">edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirmId(c.cliente_id!)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                                        title="Eliminar"
                                                    >
                                                        <span className="material-symbols-outlined text-base">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL EDITAR / CREAR CLIENTE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-[680px] w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#efc704] to-transparent opacity-80" />

                        <div className="flex justify-between items-start pb-4 mb-5 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                                    BeyonDev CRM
                                </span>
                                <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                                    {editingCliente ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg transition-all"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveCliente} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                                        Nombre del Contacto <span className="text-[#efc704]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre || ''}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej. Carlos Mendoza"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                                        Correo Electrónico <span className="text-[#efc704]">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="ejemplo@empresa.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Teléfono</label>
                                    <input
                                        type="text"
                                        value={formData.telefono || ''}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        placeholder="+504 9999-9999"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">DNI</label>
                                    <input
                                        type="text"
                                        value={formData.documento || ''}
                                        onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                                        placeholder="12345678901234"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-white/10 pt-4 mt-5">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-white/5 text-xs text-slate-300 rounded-lg hover:bg-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#efc704] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#d8b303] shadow-lg shadow-[#efc704]/20"
                                >
                                    {editingCliente ? 'Guardar Cambios' : 'Crear Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE / PERFIL DE CLIENTE */}
            {selectedCliente && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <div className="flex justify-between items-start border-b border-white/10 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704] font-bold text-xl">
                                    {selectedCliente.empresa ? selectedCliente.empresa.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-[#efc704] uppercase font-bold">Perfil de Cliente</span>
                                    <h3 className="text-lg font-bold text-white">{selectedCliente.empresa || selectedCliente.nombre}</h3>
                                    <p className="text-xs text-slate-400">{selectedCliente.nombre}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCliente(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                            <div>
                                <span className="text-slate-500 block">Correo Electrónico</span>
                                <span className="text-white font-medium truncate block">{selectedCliente.email || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Teléfono</span>
                                <span className="text-white font-medium">{selectedCliente.telefono || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Sector</span>
                                <span className="text-white font-medium">{selectedCliente.sector || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Estado</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${getStatusBadge(selectedCliente.estado)}`}>
                                    {selectedCliente.estado}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Proyectos Activos</span>
                                <span className="text-white font-bold">{selectedCliente.proyectos_activos || 0}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Inversión Histórica</span>
                                <span className="text-[#efc704] font-bold">${selectedCliente.total_invertido?.toLocaleString()}</span>
                            </div>
                        </div>

                        {selectedCliente.notas && (
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Notas / Comentarios</span>
                                <p className="text-xs text-slate-300 leading-relaxed">{selectedCliente.notas}</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedCliente(null)}
                                className="px-4 py-2 bg-white/10 text-xs text-white rounded-lg hover:bg-white/20"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRMACIÓN ELIMINAR */}
            {deleteConfirmId !== null && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 max-w-md w-full text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-2xl">warning</span>
                        </div>
                        <h3 className="text-base font-bold text-white">¿Eliminar Cliente?</h3>
                        <p className="text-xs text-slate-400">
                            Esta acción eliminará al cliente del registro activo. No se podrá deshacer.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 bg-white/5 text-xs text-slate-300 rounded-lg hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteCliente(deleteConfirmId)}
                                className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-lg hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}