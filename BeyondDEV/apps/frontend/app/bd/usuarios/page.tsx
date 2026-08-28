'use client'
import { useState } from 'react'
import { useUsuarios, createUsuario, Usuario } from '@/lib/usuarios'
import { useRoles } from '@/lib/roles'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const COLOR_PALETTE = [
    'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    'text-amber-400 border-amber-500/30 bg-amber-500/10',
    'text-sky-400 border-sky-500/30 bg-sky-500/10',
    'text-rose-400 border-rose-500/30 bg-rose-500/10',
]

export default function UsuariosPage() {
    const { data: usuarios, loading: usuarioLoading, error: usuarioError } = useUsuarios();
    const { data: roles, loading: rolLoading, error: rolError } = useRoles();

    //const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USERS)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRole, setSelectedRole] = useState('TODOS')

    // Estado Modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<Usuario | null>(null)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        rol_id: 1
    })

    // Generar iniciales
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(n => n[0].toUpperCase())
            .join('')
    }

    // Filtrado
    const filteredUsers = usuarios?.filter(u => {
        const matchesSearch = u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        // const matchesRole = selectedRole === 'TODOS' || u.rol_id === selectedRole
        return matchesSearch //&& matchesRole
    })

    // Abrir modal
    const handleOpenModal = (user?: Usuario) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                nombre: user.nombre!,
                email: user.email!,
                telefono: user.telefono!,
                rol_id: user.rol_id!
            })
        } else {
            setEditingUser(null)
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                rol_id: 1
            })
        }
        setIsModalOpen(true)
    }

    // Guardar usuario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const user = await createUsuario(formData);
        console.log(user);

        if (user) {
            alert('Usuario creado exitosamente');
            setIsModalOpen(false);
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                rol_id: 1
            })
        } else {
            alert('Error al crear usuario');
        }

        /*e.preventDefault()
        if (editingUser) {
            setUsuarios(prev =>
                prev.map(u => u.id === editingUser.id ? {
                    ...u,
                    ...formData,
                    initials: getInitials(formData.nombre)
                } : u)
            )
        } else {
            const colorIndex = usuarios.length % COLOR_PALETTE.length
            const newUser: Usuario = {
                id: Date.now().toString(),
                ...formData,
                initials: getInitials(formData.nombre),
                color: COLOR_PALETTE[colorIndex]
            }
            setUsuarios(prev => [newUser, ...prev])
        }

        setIsModalOpen(false)*/
    }

    // Eliminar usuario
    const handleDelete = (id: string) => {
        /*if (confirm('¿Estás seguro de eliminar este usuario?')) {
            setUsuarios(prev => prev.filter(u => u.id !== id))
        }*/
    }

    if (usuarioLoading || rolLoading)
        return (
            <div className="min-h-screen bg-[#050811] text-slate-200 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );

    if (usuarioError || rolError)
        return <p className="text-red-500">Error al cargar usuarios</p>

    return (
        <div className="flex-1 flex flex-col gap-6 w-full max-w-7xl p-6 md:p-8">
            {/* Encabezado y Acción */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-5">
                <div>
                    <h1 className="text-2xl font-mono font-bold text-white tracking-wide">Módulo de Usuarios</h1>
                    <p className="text-xs text-slate-400 mt-1">Gestión de accesos y perfiles del sistema</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#efc704] hover:bg-[#d4b003] text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition duration-200 shadow-lg shadow-[#efc704]/10 flex items-center gap-2 cursor-pointer"
                >
                    <span className="text-base leading-none">+</span> Nuevo Usuario
                </button>
            </div>

            {/* Controles de Búsqueda y Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Buscar usuario o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#efc704]/50 transition"
                />
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#efc704]/50"
                >
                    <option value="TODOS">Todos los Roles</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="DESARROLLADOR">DESARROLLADOR</option>
                    <option value="ANALISTA">ANALISTA</option>
                </select>
            </div>

            {/* Grid de Tarjetas de Usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers?.map((member) => (
                    <div
                        key={member.usuario_id}
                        className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center text-center relative group hover:border-white/20 transition duration-300"
                    >
                        {/* Indicador de Estado Activo/Inactivo */}
                        <div
                            title={member.estado === 'activo' ? 'Usuario Activo' : 'Usuario Inactivo'}
                            className={`absolute top-5 right-5 w-2.5 h-2.5 rounded-full ${member.estado === 'activo'
                                ? 'bg-green-400 shadow-lg shadow-green-400/50'
                                : 'bg-slate-600'
                                }`}
                        />

                        {/* Avatar e Iniciales */}
                        <div className={`w-[64px] h-[64px] rounded-full border-2 border-dashed flex items-center justify-center mb-6 bg-indigo-400`}>
                            <span className="font-mono text-xl font-bold">{member.nombre?.charAt(0).toUpperCase()}</span>
                        </div>

                        {/* Información del Usuario */}
                        <h3 className="font-mono text-base font-bold text-white mb-1">{member.nombre}</h3>
                        <span className="text-[11px] text-[#efc704] font-semibold uppercase tracking-wider mb-4">
                            {member.rol_id}
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1 break-all">
                            {member.email}
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            <span className="text-[11px] bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded text-slate-300 font-mono">
                                {member.telefono}
                            </span>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex gap-2 w-full pt-4 border-t border-white/5">
                            <button
                                onClick={() => handleOpenModal(member)}
                                className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] py-1.5 rounded border border-white/10 transition cursor-pointer"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] py-1.5 rounded border border-red-500/20 transition cursor-pointer"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers?.length === 0 && (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                    <p className="text-slate-400 text-xs">No se encontraron usuarios matching con la búsqueda.</p>
                </div>
            )}

            {/* Modal para Crear / Editar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-lg font-mono font-bold text-white mb-4">
                            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efc704]"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efc704]"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efc704]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Rol</label>
                                    <select
                                        value={formData.rol_id}
                                        onChange={(e) => setFormData({ ...formData, rol_id: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#efc704]"
                                    >
                                        {roles?.map(rol => (
                                            <option value={rol.rol_id}>{rol.tipo}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#efc704] text-black font-semibold text-xs px-4 py-2 rounded hover:bg-[#d4b003] transition"
                                >
                                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}