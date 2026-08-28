'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/ui/header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useProyectos, createProyecto, Proyecto } from '@/lib/proyectos';
import { useClientes } from '@/lib/clientes';

export default function ProyectosPage() {
    //const [proyectos, setProyectos] = useState<Proyecto[]>(MOCK_PROYECTOS);
    const { data: proyectos, loading: pLoading, error: pError } = useProyectos();
    const { data: clientes, loading: cLoading, error: cError } = useClientes();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [priorityFilter, setPriorityFilter] = useState('TODOS');
    const [typeFilter, setTypeFilter] = useState('TODOS');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null);
    const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Proyecto>>({});

    // Filtrado de proyectos
    const filteredProyectos = useMemo(() => {
        return proyectos?.filter((p) => {
            const matchesSearch =
                p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'TODOS' || p.estado === statusFilter;
            const matchesPriority = priorityFilter === 'TODOS' || p.prioridad === priorityFilter;
            const matchesType = typeFilter === 'TODOS' || p.tipo === typeFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesType;
        });
    }, [proyectos, searchTerm, statusFilter, priorityFilter, typeFilter]);

    // Métricas
    const stats = useMemo(() => {
        const total = proyectos?.length;
        const enProceso = proyectos?.filter((p) => p.estado === 'En Proceso').length;
        const finalizados = proyectos?.filter((p) => p.estado === 'Finalizado').length;
        const presupuestoTotal = proyectos?.reduce((acc, p) => acc + (p.presupuesto || 0), 0);

        return { total, enProceso, finalizados, presupuestoTotal };
    }, [proyectos]);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditingProyecto(null);
        setFormData({
            cliente_id: 1,
            nombre: '',
            tipo: 'Sistema',
            descripcion: '',
            prioridad: 'Media',
            estado: 'En Proceso',
            fecha_inicio: '',
            entrega_propuesta: '',
            presupuesto: 0
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (proyecto: Proyecto) => {
        setEditingProyecto(proyecto);
        setFormData({ ...proyecto });
        setIsModalOpen(true);
    };

    const handleSaveProyecto = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProject = await createProyecto(formData);
        console.log(newProject);

        if (newProject) {
            console.log("Proyecto creado exitosamente: ", newProject);
            setIsModalOpen(false);
        } else {
            console.log("Error al crear el proyecto");
        }
    };

    // Badges estilizados
    const getPriorityBadge = (prioridad?: string) => {
        switch (prioridad) {
            case 'Urgente':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            case 'Alta':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'Media':
                return 'bg-[#efc704]/10 text-[#efc704] border-[#efc704]/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusBadge = (estado?: string) => {
        switch (estado) {
            case 'En Proceso':
                return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
            case 'Finalizado':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'En Espera':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'Cancelado':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    if (pLoading || cLoading)
        return (
            <div className="min-h-screen bg-[#050811] text-slate-200 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );


    if (pError || cError)
        return <p className="text-red-500">Error</p>

    console.log("Clientes: ", clientes)
    console.log("Proyectos: ", proyectos)

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#050811] text-slate-200 p-8 sm:p-6 lg:p-8 min-h-screen">
            <Header title="Proyectos" subtitle="Estado, presupuesto e historial operacional de proyectos" />

            <div className="flex-1 flex flex-col gap-6 w-full max-w-7xl">

                {/* KPI CARDS METRICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Proyectos</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704]">
                                <span className="material-symbols-outlined">folder</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Proyectos registrados en el sistema</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">En Proceso</p>
                                <h3 className="text-2xl font-bold text-sky-400 mt-1">{stats.enProceso}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                                <span className="material-symbols-outlined">sync</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Actualmente en desarrollo activo</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Finalizados</p>
                                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.finalizados}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Completados y entregados</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Presupuesto Global</p>
                                <h3 className="text-2xl font-bold text-[#efc704] mt-1">
                                    ${stats.presupuestoTotal?.toLocaleString('en-US')}
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704]">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Suma de valor total acumulado</p>
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
                            placeholder="Buscar por proyecto o cliente..."
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
                            <option value="En Proceso">En Proceso</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="En Espera">En Espera</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-[#0a0f19] border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-[#efc704]"
                        >
                            <option value="TODOS">Todas las Prioridades</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-[#0a0f19] border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-[#efc704]"
                        >
                            <option value="TODOS">Todos los Tipos</option>
                            <option value="Sistema">Sistema</option>
                            <option value="Aplicacion Movil">Aplicación Móvil</option>
                            <option value="Pagina Web">Página Web</option>
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

                        {/* CTA Nuevo Proyecto */}
                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="px-4 py-2 bg-[#efc704] text-slate-950 font-bold text-xs rounded-xl hover:bg-[#d8b303] shadow-lg shadow-[#efc704]/20 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            Nuevo Proyecto
                        </button>
                    </div>
                </div>

                {/* LISTADO DE PROYECTOS */}
                {filteredProyectos?.length === 0 ? (
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">folder_off</span>
                        <p className="text-white font-semibold">No se encontraron proyectos</p>
                        <p className="text-xs text-slate-400 mt-1">Intenta ajustando los filtros o el término de búsqueda.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* VISTA EN GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredProyectos?.map((p) => (
                            <div
                                key={p.proyecto_id}
                                className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 hover:border-[#efc704]/50 transition-all flex flex-col justify-between group shadow-lg"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-mono tracking-wider text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                                            {p.tipo}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                                                    p.prioridad
                                                )}`}
                                            >
                                                {p.prioridad}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                                    p.estado
                                                )}`}
                                            >
                                                {p.estado}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-base font-bold text-white group-hover:text-[#efc704] transition-colors line-clamp-1">
                                        {p.nombre}
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.descripcion}</p>

                                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Cliente:</span>
                                            <span className="text-white font-medium">{clientes?.find(c => c.cliente_id === p.cliente_id)?.nombre || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Presupuesto:</span>
                                            <span className="text-[#efc704] font-bold">${p.presupuesto?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Entrega:</span>
                                            <span className="text-slate-300">{p.entrega_propuesta || 'Sin fecha'}</span>
                                        </div>
                                    </div>

                                    {/* Barra de Progreso */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-[11px] mb-1">
                                            <span className="text-slate-400">Avance</span>
                                            <span className="text-white font-bold">{p.progreso || 0}%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-[#efc704] to-amber-500 h-full transition-all duration-300"
                                                style={{ width: `${p.progreso || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-5">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProyecto(p)}
                                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span> Detalle
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(p)}
                                            className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-base">edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmId(p.proyecto_id!)}
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
                                        <th className="p-4">Proyecto</th>
                                        <th className="p-4">Cliente</th>
                                        <th className="p-4">Tipo</th>
                                        <th className="p-4">Prioridad</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4">Presupuesto</th>
                                        <th className="p-4">Progreso</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    {filteredProyectos?.map((p) => (
                                        <tr key={p.proyecto_id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-semibold text-white">
                                                <div>{p.nombre}</div>
                                                <span className="text-[10px] text-slate-500 font-normal">{p.fecha_inicio}</span>
                                            </td>
                                            <td className="p-4 text-slate-300">{clientes?.find(c => c.cliente_id === p.cliente_id)?.nombre || 'N/A'}</td>
                                            <td className="p-4">
                                                <span className="text-[10px] font-mono text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold">
                                                    {p.tipo}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(p.prioridad)}`}>
                                                    {p.prioridad}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(p.estado)}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[#efc704] font-bold">${p.presupuesto?.toLocaleString()}</td>
                                            <td className="p-4 w-32">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-[#efc704] h-full"
                                                            style={{ width: `${p.progreso || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-mono">{p.progreso}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedProyecto(p)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        title="Ver Detalle"
                                                    >
                                                        <span className="material-symbols-outlined text-base">visibility</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(p)}
                                                        className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-base">edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirmId(p.proyecto_id!)}
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

            {/* MODAL EDITAR / CREAR PROYECTO */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-[680px] w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#efc704] to-transparent opacity-80" />

                        <div className="flex justify-between items-start pb-4 mb-5 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                                    BeyonDev Systems
                                </span>
                                <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                                    {editingProyecto ? 'Editar Proyecto' : 'Registrar Nuevo Proyecto'}
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

                        <form onSubmit={(e) => handleSaveProyecto(e)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                                        Nombre del Proyecto <span className="text-[#efc704]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre || ''}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej. Portal de Contratos"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                                        Tipo de Proyecto <span className="text-[#efc704]">*</span>
                                    </label>
                                    <select
                                        value={formData.tipo || 'Sistema'}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                        className="w-full bg-[#0a0f19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    >
                                        <option value="Sistema">Sistema</option>
                                        <option value="Aplicacion Movil">Aplicación Móvil</option>
                                        <option value="Pagina Web">Página Web</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                                        Prioridad <span className="text-[#efc704]">*</span>
                                    </label>
                                    <select
                                        value={formData.prioridad || 'Media'}
                                        onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                                        className="w-full bg-[#0a0f19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    >
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Urgente">Urgente</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                                        Estado <span className="text-[#efc704]">*</span>
                                    </label>
                                    <select
                                        value={formData.estado || 'En Proceso'}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full bg-[#0a0f19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    >
                                        <option value="En Proceso">En Proceso</option>
                                        <option value="Finalizado">Finalizado</option>
                                        <option value="En Espera">En Espera</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Fecha de Inicio</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_inicio || ''}
                                        onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704] [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Entrega Propuesta</label>
                                    <input
                                        type="date"
                                        value={formData.entrega_propuesta || ''}
                                        onChange={(e) => setFormData({ ...formData, entrega_propuesta: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704] [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Cliente / Empresa</label>
                                    <select name="" id="" value={formData.cliente_id} onChange={(e) => setFormData({ ...formData, cliente_id: Number(e.target.value) })} className="w-full bg-[#0a0f19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]">
                                        {clientes?.map(cliente => (
                                            <option key={cliente.cliente_id} value={cliente.cliente_id}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Presupuesto ($)</label>
                                    <input
                                        type="number"
                                        value={formData.presupuesto || 0}
                                        onChange={(e) => setFormData({ ...formData, presupuesto: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-300 mb-1 block">Progreso de Avance (%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.progreso || 0}
                                    onChange={(e) => setFormData({ ...formData, progreso: Number(e.target.value) })}
                                    className="w-full accent-[#efc704] bg-white/5 rounded-lg cursor-pointer"
                                />
                                <div className="text-right text-xs font-mono text-[#efc704]">{formData.progreso || 0}%</div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-300 mb-1 block">Descripción</label>
                                <textarea
                                    rows={3}
                                    value={formData.descripcion || ''}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Detalles sobre los requerimientos y alcance..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704] resize-none"
                                />
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
                                    {editingProyecto ? 'Guardar Cambios' : 'Crear Proyecto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE DE PROYECTO */}
            {selectedProyecto && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <div className="flex justify-between items-start border-b border-white/10 pb-3">
                            <div>
                                <span className="text-[10px] font-mono text-[#efc704] uppercase font-bold">Detalle del Proyecto</span>
                                <h3 className="text-lg font-bold text-white">{selectedProyecto.nombre}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedProyecto(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{selectedProyecto.descripcion}</p>

                        <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                            <div>
                                <span className="text-slate-500 block">Cliente</span>
                                <span className="text-white font-medium">{selectedProyecto.cliente || 'Sin cliente'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Tipo</span>
                                <span className="text-white font-medium">{selectedProyecto.tipo}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Fecha Inicio</span>
                                <span className="text-white font-medium">{selectedProyecto.fecha_inicio || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Entrega</span>
                                <span className="text-white font-medium">{selectedProyecto.entrega_propuesta || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Presupuesto</span>
                                <span className="text-[#efc704] font-bold">${selectedProyecto.presupuesto?.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Estado</span>
                                <span className="text-white font-medium">{selectedProyecto.estado}</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedProyecto(null)}
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
                        <h3 className="text-base font-bold text-white">¿Eliminar Proyecto?</h3>
                        <p className="text-xs text-slate-400">
                            Esta acción no se puede deshacer y borrará permanentemente la información del proyecto.
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
                                //onClick={() => handleDeleteProyecto(deleteConfirmId)}
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