'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/ui/header';
import { Tarea, useTareas, createTarea } from '@/lib/tareas';
import { useProyectos } from '@/lib/proyectos';
import { useUsuarios } from '@/lib/usuarios';

export default function TareasPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [priorityFilter, setPriorityFilter] = useState('TODOS');
    const [projectFilter, setProjectFilter] = useState('TODOS');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const { data: tareas, loading: tareasLoading, error: tareasError } = useTareas();
    const { data: proyectos, loading: proyectosLoading, error: proyectosError } = useProyectos();
    const { data: usuarios, loading: usuariosLoading, error: usuariosError } = useUsuarios();

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
    const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Tarea>>({});

    // Filtrado de tareas
    const filteredTareas = useMemo(() => {
        return tareas?.filter((t) => {
            const matchesSearch =
                t.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                //t.proyecto_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                //t.usuario_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'TODOS' || t.estado === statusFilter;
            const matchesPriority = priorityFilter === 'TODOS' || t.prioridad === priorityFilter;
            //const matchesProject = projectFilter === 'TODOS' || t.proyecto === projectFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tareas, searchTerm, statusFilter, priorityFilter]);

    // Lista única de proyectos para el filtro
    const proyectosDisponibles = useMemo(() => {
        const list = tareas?.map((t) => t.proyecto_id).filter(Boolean) as number[];
        return Array.from(new Set(list));
    }, [tareas]);

    // Métricas KPI
    const stats = useMemo(() => {
        const total = tareas?.length;
        const pendientes = tareas?.filter((t) => t.estado === 'Pendiente').length;
        const enProceso = tareas?.filter((t) => t.estado === 'En Proceso' || t.estado === 'En Revisión').length;
        const completadas = tareas?.filter((t) => t.estado === 'Completada').length;

        return { total, pendientes, enProceso, completadas };
    }, [tareas]);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditingTarea(null);
        setFormData({
            titulo: '',
            descripcion: '',
            proyecto_id: 0,
            usuario_id: 0,
            prioridad: 'Media',
            estado: 'Pendiente'
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (tarea: Tarea) => {
        setEditingTarea(tarea);
        setFormData({ ...tarea });
        setIsModalOpen(true);
    };

    const handleSaveTarea = async (e: React.FormEvent) => {
        e.preventDefault();

        const newTask = await createTarea(formData);

        if (newTask) {
            setIsModalOpen(false);
        }
        else {
            alert('Error al crear la tarea');
        }
    };

    const handleToggleEstado = (tarea: Tarea) => {
        /*
        const nuevoEstado = tarea.estado === 'Completada' ? 'En Proceso' : 'Completada';
        setTareas((prev) =>
            prev.map((t) => (t.tarea_id === tarea.tarea_id ? { ...t, estado: nuevoEstado } : t))
        );
        */
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
            case 'Completada':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'En Proceso':
                return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
            case 'En Revisión':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'Pendiente':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    if (proyectosLoading || tareasLoading || usuariosLoading) {
        return (
            <div className="lg:ml-[280px] lg:mt-[30px] flex-1 flex flex-col min-w-0 bg-[#050811] text-slate-200 p-4 sm:p-6 lg:p-8 min-h-screen">
                <Header title="Gestión de Tareas" subtitle="Asignación, seguimiento y control de pendientes operativos" />
                <p className="text-white font-semibold">Cargando...</p>
            </div>
        );
    }

    if (proyectosError || tareasError || usuariosError) {
        return (
            <div className="lg:ml-[280px] lg:mt-[30px] flex-1 flex flex-col min-w-0 bg-[#050811] text-slate-200 p-4 sm:p-6 lg:p-8 min-h-screen">
                <Header title="Gestión de Tareas" subtitle="Asignación, seguimiento y control de pendientes operativos" />
                <p className="text-white font-semibold">Error al cargar las tareas</p>
            </div>
        );
    }

    console.log('tareas', tareas);

    return (
        <div className="lg:ml-[280px] lg:mt-[30px] flex-1 flex flex-col min-w-0 bg-[#050811] text-slate-200 p-4 sm:p-6 lg:p-8 min-h-screen">
            <Header title="Gestión de Tareas" subtitle="Asignación, seguimiento y control de pendientes operativos" />

            <div className="flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto">

                {/* KPI CARDS METRICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Tareas</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704]">
                                <span className="material-symbols-outlined">task_alt</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Tareas registradas en el flujo</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Por Hacer</p>
                                <h3 className="text-2xl font-bold text-amber-400 mt-1">{stats.pendientes}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Pendientes de iniciar desarrollo</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">En Ejecución</p>
                                <h3 className="text-2xl font-bold text-sky-400 mt-1">{stats.enProceso}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                                <span className="material-symbols-outlined">autorenew</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">En desarrollo o fase de revisión</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Completadas</p>
                                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.completadas}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Entregadas y verificadas</p>
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
                            placeholder="Buscar por tarea, proyecto o encargado..."
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
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Completada">Completada</option>
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
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="bg-[#0a0f19] border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-[#efc704]"
                        >
                            <option value="TODOS">Todos los Proyectos</option>
                            {proyectosDisponibles.map((proyecto) => (
                                <option key={proyecto} value={proyecto}>
                                    {proyecto}
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

                        {/* CTA Nueva Tarea */}
                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="px-4 py-2 bg-[#efc704] text-slate-950 font-bold text-xs rounded-xl hover:bg-[#d8b303] shadow-lg shadow-[#efc704]/20 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">add_task</span>
                            Nueva Tarea
                        </button>
                    </div>
                </div>

                {/* LISTADO DE TAREAS */}
                {filteredTareas?.length === 0 ? (
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">task</span>
                        <p className="text-white font-semibold">No se encontraron tareas</p>
                        <p className="text-xs text-slate-400 mt-1">Intenta ajustando los filtros o el término de búsqueda.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* VISTA EN GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTareas?.map((t) => (
                            <div
                                key={t.tarea_id}
                                className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 hover:border-[#efc704]/50 transition-all flex flex-col justify-between group shadow-lg relative overflow-hidden"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-mono tracking-wider text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold uppercase truncate max-w-[150px]">
                                            {t.proyecto_id}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(t.prioridad)}`}>
                                                {t.prioridad}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(t.estado)}`}>
                                                {t.estado}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Toggle Checkbox & Title */}
                                    <div className="flex items-start gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleEstado(t)}
                                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${t.estado === 'Completada'
                                                ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                                : 'border-white/20 hover:border-[#efc704] text-transparent'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </button>
                                        <h4
                                            className={`text-sm font-bold transition-colors ${t.estado === 'Completada' ? 'line-through text-slate-500' : 'text-white group-hover:text-[#efc704]'
                                                }`}
                                        >
                                            {t.titulo}
                                        </h4>
                                    </div>

                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 pl-7">{t.descripcion}</p>

                                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-slate-300">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <span className="material-symbols-outlined text-sm">person</span>
                                                <span className="text-white font-medium">{t.nombre_usuario || 'Sin asignar'}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span>{t.fecha_asignacion}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Actions & Footer */}
                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-5 text-xs">
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <span className="material-symbols-outlined text-sm">event</span>
                                        <span className="text-[11px]">{t.fecha_limite || 'Sin límite'}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTarea(t)}
                                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            title="Ver Detalle"
                                        >
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(t)}
                                            className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-base">edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmId(t.tarea_id!)}
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
                                        <th className="p-4 w-10"></th>
                                        <th className="p-4">Tarea</th>
                                        <th className="p-4">Proyecto</th>
                                        <th className="p-4">Asignado a</th>
                                        <th className="p-4">Prioridad</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4">Límite</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    {filteredTareas?.map((t) => (
                                        <tr key={t.tarea_id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleEstado(t)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${t.estado === 'Completada'
                                                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                                        : 'border-white/20 hover:border-[#efc704] text-transparent'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                                                </button>
                                            </td>
                                            <td className="p-4 font-semibold text-white max-w-xs">
                                                <div className={t.estado === 'Completada' ? 'line-through text-slate-500' : 'text-white'}>
                                                    {t.titulo}
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-normal line-clamp-1">{t.descripcion}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[10px] font-mono text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold">
                                                    {t.proyecto_id}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-300 font-medium">{t.asignado_a || 'Sin Asignar'}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(t.prioridad)}`}>
                                                    {t.prioridad}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(t.estado)}`}>
                                                    {t.estado}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-400 font-mono text-[11px]">{t.fecha_limite || 'N/A'}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTarea(t)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        title="Ver Detalle"
                                                    >
                                                        <span className="material-symbols-outlined text-base">visibility</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(t)}
                                                        className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-base">edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirmId(t.tarea_id!)}
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

            {/* MODAL EDITAR / CREAR TAREA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-[680px] w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#efc704] to-transparent opacity-80" />

                        <div className="flex justify-between items-start pb-4 mb-5 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                                    BeyonDev Tasks
                                </span>
                                <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                                    {editingTarea ? 'Editar Tarea' : 'Registrar Nueva Tarea'}
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

                        <form onSubmit={handleSaveTarea} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-300 mb-1 block">
                                    Título de la Tarea <span className="text-[#efc704]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.titulo || ''}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    placeholder="Ej. Implementar integración de pagos"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                                        Proyecto <span className="text-[#efc704]">*</span>
                                    </label>
                                    <select value={formData.proyecto_id} onChange={(e) => setFormData({ ...formData, proyecto_id: parseInt(e.target.value) })}
                                        className="w-full border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    >
                                        {proyectos?.map(proyecto => (
                                            <option key={proyecto.proyecto_id} value={proyecto.proyecto_id}>{proyecto.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Asignado a</label>
                                    <select value={formData.usuario_id} onChange={(e) => setFormData({ ...formData, usuario_id: parseInt(e.target.value) })}
                                        className="w-full border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    >
                                        {usuarios?.map(usuario => (
                                            <option key={usuario.usuario_id} value={usuario.usuario_id}>{usuario.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Prioridad</label>
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
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Estado</label>
                                    <select
                                        value={formData.estado || 'Pendiente'}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full bg-[#0a0f19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En Proceso">En Proceso</option>
                                        <option value="En Revisión">En Revisión</option>
                                        <option value="Completada">Completada</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Fecha Límite</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_limite || ''}
                                        onChange={(e) => setFormData({ ...formData, fecha_limite: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704] [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Horas Estimadas</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.horas_estimadas || 4}
                                        onChange={(e) => setFormData({ ...formData, horas_estimadas: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-300 mb-1 block">Descripción</label>
                                <textarea
                                    rows={3}
                                    value={formData.descripcion || ''}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Detalles del entregable o especificaciones de la tarea..."
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
                                    {editingTarea ? 'Guardar Cambios' : 'Crear Tarea'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE DE TAREA */}
            {selectedTarea && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <div className="flex justify-between items-start border-b border-white/10 pb-3">
                            <div>
                                <span className="text-[10px] font-mono text-[#efc704] uppercase font-bold">Detalle de Tarea</span>
                                <h3 className="text-lg font-bold text-white">{selectedTarea.titulo}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedTarea(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{selectedTarea.descripcion}</p>

                        <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                            <div>
                                <span className="text-slate-500 block">Proyecto</span>
                                <span className="text-[#efc704] font-bold">{selectedTarea.proyecto}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Asignado a</span>
                                <span className="text-white font-medium">{selectedTarea.asignado_a || 'Sin asignar'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Prioridad</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${getPriorityBadge(selectedTarea.prioridad)}`}>
                                    {selectedTarea.prioridad}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Estado</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${getStatusBadge(selectedTarea.estado)}`}>
                                    {selectedTarea.estado}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Fecha Límite</span>
                                <span className="text-white font-medium">{selectedTarea.fecha_limite || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Estimación</span>
                                <span className="text-white font-medium">{selectedTarea.horas_estimadas} Horas</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedTarea(null)}
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
                        <h3 className="text-base font-bold text-white">¿Eliminar Tarea?</h3>
                        <p className="text-xs text-slate-400">
                            Esta acción eliminará la tarea del flujo de trabajo de forma permanente.
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
                                onClick={() => handleDeleteTarea(deleteConfirmId)}
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