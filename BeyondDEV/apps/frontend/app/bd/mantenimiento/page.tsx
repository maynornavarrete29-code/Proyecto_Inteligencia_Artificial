'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/ui/header';

export interface Mantenimiento {
    mantenimiento_id?: number;
    cliente_proyecto?: string;
    tipo_servicio?: string;
    frecuencia?: string; // Mensual, Trimestral, Anual, Por Demanda
    estado?: string; // Activo, Por Vencer, Vencido, Suspendido
    monto_periodico?: number;
    fecha_inicio?: string;
    fecha_renovacion?: string;
    tecnico_responsable?: string;
    descripcion_sla?: string;
    [key: string]: any;
}

// Datos de demostración iniciales
const MOCK_MANTENIMIENTOS: Mantenimiento[] = [
    {
        mantenimiento_id: 1,
        cliente_proyecto: 'Portal ERP - Grupo Logístico',
        tipo_servicio: 'SLA 24/7 & Hosting Cloud',
        frecuencia: 'Mensual',
        estado: 'Activo',
        monto_periodico: 450,
        fecha_inicio: '2025-01-15',
        fecha_renovacion: '2026-03-15',
        tecnico_responsable: 'Carlos Mendoza',
        descripcion_sla: 'Monitoreo de servidores AWS, respaldos diarios de BD y máximo 2 horas de tiempo de respuesta.',
    },
    {
        mantenimiento_id: 2,
        cliente_proyecto: 'E-Commerce Moda & Estilo',
        tipo_servicio: 'Bolsa de Horas (15h/mes) + parches',
        frecuencia: 'Mensual',
        estado: 'Por Vencer',
        monto_periodico: 300,
        fecha_inicio: '2025-06-01',
        fecha_renovacion: '2026-03-01',
        tecnico_responsable: 'Sofía Castro',
        descripcion_sla: 'Mantenimiento evolutivo de plugins Shopify/Next.js y optimización SEO mensual.',
    },
    {
        mantenimiento_id: 3,
        cliente_proyecto: 'App Móvil de Repartidores',
        tipo_servicio: 'Mantenimiento Preventivo & API Support',
        frecuencia: 'Trimestral',
        estado: 'Activo',
        monto_periodico: 850,
        fecha_inicio: '2024-11-10',
        fecha_renovacion: '2026-05-10',
        tecnico_responsable: 'Miguel Torres',
        descripcion_sla: 'Renovación de certificados SSL, actualización de librerías iOS/Android y pruebas de carga.',
    },
    {
        mantenimiento_id: 4,
        cliente_proyecto: 'Plataforma Educativa EdTech',
        tipo_servicio: 'Soporte Core & Corrección de Bugs',
        frecuencia: 'Anual',
        estado: 'Vencido',
        monto_periodico: 2400,
        fecha_inicio: '2025-02-01',
        fecha_renovacion: '2026-02-01',
        tecnico_responsable: 'Ana López',
        descripcion_sla: 'Soporte preventivo anual y renovación de dominio empresarial.',
    },
];

export default function MantenimientoPage() {
    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>(MOCK_MANTENIMIENTOS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TODOS');
    const [frequencyFilter, setFrequencyFilter] = useState('TODOS');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Modales state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Mantenimiento | null>(null);
    const [selectedItem, setSelectedItem] = useState<Mantenimiento | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Mantenimiento>>({});

    // Filtrado de mantenimientos
    const filteredMantenimientos = useMemo(() => {
        return mantenimientos.filter((m) => {
            const matchesSearch =
                m.cliente_proyecto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.tipo_servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.tecnico_responsable?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'TODOS' || m.estado === statusFilter;
            const matchesFrequency = frequencyFilter === 'TODOS' || m.frecuencia === frequencyFilter;

            return matchesSearch && matchesStatus && matchesFrequency;
        });
    }, [mantenimientos, searchTerm, statusFilter, frequencyFilter]);

    // Métricas KPI
    const stats = useMemo(() => {
        const total = mantenimientos.length;
        const activos = mantenimientos.filter((m) => m.estado === 'Activo').length;
        const porVencer = mantenimientos.filter((m) => m.estado === 'Por Vencer').length;
        const vencidos = mantenimientos.filter((m) => m.estado === 'Vencido').length;

        // Estimado de Ingreso Mensual Recurrente (MRR)
        const mrrTotal = mantenimientos.reduce((acc, curr) => {
            if (curr.estado === 'Suspendido' || curr.estado === 'Vencido') return acc;
            const monto = curr.monto_periodico || 0;
            if (curr.frecuencia === 'Anual') return acc + monto / 12;
            if (curr.frecuencia === 'Trimestral') return acc + monto / 3;
            return acc + monto; // Mensual o por demanda
        }, 0);

        return { total, activos, porVencer, vencidos, mrrTotal };
    }, [mantenimientos]);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditingItem(null);
        setFormData({
            cliente_proyecto: '',
            tipo_servicio: 'SLA & Monitoreo Cloud',
            frecuencia: 'Mensual',
            estado: 'Activo',
            monto_periodico: 250,
            fecha_inicio: new Date().toISOString().split('T')[0],
            fecha_renovacion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            tecnico_responsable: '',
            descripcion_sla: '',
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: Mantenimiento) => {
        setEditingItem(item);
        setFormData({ ...item });
        setIsModalOpen(true);
    };

    const handleSaveMantenimiento = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setMantenimientos((prev) =>
                prev.map((m) => (m.mantenimiento_id === editingItem.mantenimiento_id ? ({ ...formData } as Mantenimiento) : m))
            );
        } else {
            const newId = Math.max(...mantenimientos.map((m) => m.mantenimiento_id || 0), 0) + 1;
            setMantenimientos((prev) => [...prev, { ...formData, mantenimiento_id: newId } as Mantenimiento]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteMantenimiento = (id: number) => {
        setMantenimientos((prev) => prev.filter((m) => m.mantenimiento_id !== id));
        setDeleteConfirmId(null);
    };

    // Helper de badges
    const getStatusBadge = (estado?: string) => {
        switch (estado) {
            case 'Activo':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'Por Vencer':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            case 'Vencido':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            case 'Suspendido':
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    const getFrequencyBadge = (frecuencia?: string) => {
        switch (frecuencia) {
            case 'Mensual':
                return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
            case 'Trimestral':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'Anual':
                return 'bg-[#efc704]/10 text-[#efc704] border-[#efc704]/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="lg:ml-[280px] lg:mt-[30px] flex-1 flex flex-col min-w-0 bg-[#050811] text-slate-200 p-4 sm:p-6 lg:p-8 min-h-screen">
            <Header
                title="Planes de Mantenimiento & SLA"
                subtitle="Gestión de contratos recurrentes, garantías y pólizas de soporte técnico"
            />

            <div className="flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto">
                {/* METRICAS KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Contratos</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#efc704]/10 border border-[#efc704]/30 flex items-center justify-center text-[#efc704]">
                                <span className="material-symbols-outlined">shield_with_heart</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Pólizas y servicios registrados</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Contratos Activos</p>
                                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.activos}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">En cobertura con pago al día</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Por Vencer / Vencidos</p>
                                <h3 className="text-2xl font-bold text-amber-400 mt-1">
                                    {stats.porVencer} <span className="text-xs text-rose-400 font-normal">({stats.vencidos} vencidos)</span>
                                </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <span className="material-symbols-outlined">notification_important</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Requieren renovación inmediata</p>
                    </div>

                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Ingreso Recurrente (MRR)</p>
                                <h3 className="text-2xl font-bold text-sky-400 mt-1">${stats.mrrTotal.toFixed(0)} USD</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Facturación mensual aproximada</p>
                    </div>
                </div>

                {/* FILTROS Y CONTROLES */}
                <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-72">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar cliente, proyecto o técnico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704] transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#0a0f19] border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-[#efc704]"
                        >
                            <option value="TODOS">Todos los Estados</option>
                            <option value="Activo">Activo</option>
                            <option value="Por Vencer">Por Vencer</option>
                            <option value="Vencido">Vencido</option>
                            <option value="Suspendido">Suspendido</option>
                        </select>

                        <select
                            value={frequencyFilter}
                            onChange={(e) => setFrequencyFilter(e.target.value)}
                            className="bg-[#0a0f19] border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-[#efc704]"
                        >
                            <option value="TODOS">Todas las Frecuencias</option>
                            <option value="Mensual">Mensual</option>
                            <option value="Trimestral">Trimestral</option>
                            <option value="Anual">Anual</option>
                            <option value="Por Demanda">Por Demanda</option>
                        </select>

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

                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="px-4 py-2 bg-[#efc704] text-slate-950 font-bold text-xs rounded-xl hover:bg-[#d8b303] shadow-lg shadow-[#efc704]/20 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">add_moderator</span>
                            Nuevo Mantenimiento
                        </button>
                    </div>
                </div>

                {/* CONTENIDO DE LISTA */}
                {filteredMantenimientos.length === 0 ? (
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">build_circle</span>
                        <p className="text-white font-semibold">No se encontraron mantenimientos</p>
                        <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o crea un nuevo contrato de soporte.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* GRID VIEW */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredMantenimientos.map((m) => (
                            <div
                                key={m.mantenimiento_id}
                                className="bg-[#0a0f19] border border-white/10 rounded-2xl p-5 hover:border-[#efc704]/50 transition-all flex flex-col justify-between group shadow-lg relative overflow-hidden"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <span className="text-[10px] font-mono tracking-wider text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold uppercase truncate max-w-[150px]">
                                            {m.frecuencia}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(m.estado)}`}>
                                            {m.estado}
                                        </span>
                                    </div>

                                    <h4 className="text-base font-bold text-white group-hover:text-[#efc704] transition-colors">
                                        {m.cliente_proyecto}
                                    </h4>
                                    <p className="text-xs text-slate-300 font-medium mt-1">{m.tipo_servicio}</p>
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{m.descripcion_sla}</p>

                                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-slate-300">
                                            <span className="text-slate-400 text-[11px]">Técnico a cargo:</span>
                                            <span className="text-white font-medium">{m.tecnico_responsable || 'No asignado'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-300">
                                            <span className="text-slate-400 text-[11px]">Costo Periódico:</span>
                                            <span className="text-emerald-400 font-bold font-mono">${m.monto_periodico} USD</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-5 text-xs">
                                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                                        <span className="material-symbols-outlined text-sm text-[#efc704]">event_repeat</span>
                                        <span>Renueva: {m.fecha_renovacion || 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedItem(m)}
                                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            title="Ver Detalle"
                                        >
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(m)}
                                            className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-base">edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmId(m.mantenimiento_id!)}
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
                    /* TABLE VIEW */
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400 uppercase bg-white/5">
                                        <th className="p-4">Cliente / Proyecto</th>
                                        <th className="p-4">Servicio / SLA</th>
                                        <th className="p-4">Frecuencia</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4">Monto</th>
                                        <th className="p-4">Próxima Renovación</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs">
                                    {filteredMantenimientos.map((m) => (
                                        <tr key={m.mantenimiento_id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-semibold text-white">{m.cliente_proyecto}</td>
                                            <td className="p-4 text-slate-300">
                                                {m.tipo_servicio}
                                                <span className="block text-[10px] text-slate-500">{m.tecnico_responsable}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getFrequencyBadge(m.frecuencia)}`}>
                                                    {m.frecuencia}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(m.estado)}`}>
                                                    {m.estado}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-emerald-400">${m.monto_periodico} USD</td>
                                            <td className="p-4 text-slate-400 font-mono text-[11px]">{m.fecha_renovacion}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedItem(m)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                        title="Ver Detalle"
                                                    >
                                                        <span className="material-symbols-outlined text-base">visibility</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(m)}
                                                        className="p-1.5 text-slate-400 hover:text-[#efc704] hover:bg-white/5 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-base">edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirmId(m.mantenimiento_id!)}
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

            {/* MODAL CREAR / EDITAR */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-[680px] w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#efc704] to-transparent opacity-80" />

                        <div className="flex justify-between items-start pb-4 mb-5 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-[#efc704] bg-[#efc704]/10 border border-[#efc704]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                                    Pólizas & Mantenimiento
                                </span>
                                <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                                    {editingItem ? 'Editar Contrato de Mantenimiento' : 'Registrar Nuevo Mantenimiento'}
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

                        <form onSubmit={handleSaveMantenimiento} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-300 mb-1 block">
                                    Cliente o Proyecto <span className="text-[#efc704]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.cliente_proyecto || ''}
                                    onChange={(e) => setFormData({ ...formData, cliente_proyecto: e.target.value })}
                                    placeholder="Ej. Portal ERP - Empresa X"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Tipo de Servicio</label>
                                    <input
                                        type="text"
                                        value={formData.tipo_servicio || ''}
                                        onChange={(e) => setFormData({ ...formData, tipo_servicio: e.target.value })}
                                        placeholder="Ej. SLA 24/7 & Hosting AWS"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Técnico Responsable</label>
                                    <input
                                        type="text"
                                        value={formData.tecnico_responsable || ''}
                                        onChange={(e) => setFormData({ ...formData, tecnico_responsable: e.target.value })}
                                        placeholder="Ej. Carlos Mendoza"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#efc704]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Frecuencia de Cobro</label>
                                    <select
                                        value={formData.frecuencia || 'Mensual'}
                                        onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
                                        className="w-full bg-[#0a0f19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    >
                                        <option value="Mensual">Mensual</option>
                                        <option value="Trimestral">Trimestral</option>
                                        <option value="Anual">Anual</option>
                                        <option value="Por Demanda">Por Demanda</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Estado del Servicio</label>
                                    <select
                                        value={formData.estado || 'Activo'}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full bg-[#0a0f19] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Por Vencer">Por Vencer</option>
                                        <option value="Vencido">Vencido</option>
                                        <option value="Suspendido">Suspendido</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Monto Periódico (USD)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.monto_periodico || 0}
                                        onChange={(e) => setFormData({ ...formData, monto_periodico: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-300 mb-1 block">Fecha Próxima Renovación</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_renovacion || ''}
                                        onChange={(e) => setFormData({ ...formData, fecha_renovacion: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#efc704] [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-300 mb-1 block">Alcance / Descripción SLA</label>
                                <textarea
                                    rows={3}
                                    value={formData.descripcion_sla || ''}
                                    onChange={(e) => setFormData({ ...formData, descripcion_sla: e.target.value })}
                                    placeholder="Detalles sobre entregables, garantías, tiempos de respuesta y horas reservadas..."
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
                                    {editingItem ? 'Guardar Cambios' : 'Registrar Mantenimiento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE DE MANTENIMIENTO */}
            {selectedItem && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
                    <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <div className="flex justify-between items-start border-b border-white/10 pb-3">
                            <div>
                                <span className="text-[10px] font-mono text-[#efc704] uppercase font-bold">Detalle del Contrato</span>
                                <h3 className="text-lg font-bold text-white">{selectedItem.cliente_proyecto}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedItem(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{selectedItem.descripcion_sla}</p>

                        <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                            <div>
                                <span className="text-slate-500 block">Tipo de Servicio</span>
                                <span className="text-white font-medium">{selectedItem.tipo_servicio}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Técnico a Cargo</span>
                                <span className="text-white font-medium">{selectedItem.tecnico_responsable || 'No asignado'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Frecuencia</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${getFrequencyBadge(selectedItem.frecuencia)}`}>
                                    {selectedItem.frecuencia}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Estado</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${getStatusBadge(selectedItem.estado)}`}>
                                    {selectedItem.estado}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Monto Periódico</span>
                                <span className="text-emerald-400 font-bold font-mono">${selectedItem.monto_periodico} USD</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Renovación</span>
                                <span className="text-white font-medium">{selectedItem.fecha_renovacion}</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedItem(null)}
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
                        <h3 className="text-base font-bold text-white">¿Eliminar Contrato?</h3>
                        <p className="text-xs text-slate-400">
                            Esta acción eliminará el registro de mantenimiento y su métrica asociada.
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
                                onClick={() => handleDeleteMantenimiento(deleteConfirmId)}
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