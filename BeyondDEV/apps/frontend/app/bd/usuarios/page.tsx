'use client'
import { useState } from 'react'
import { useUsuarios } from '../../../lib/usuarios'

export default function UsuariosPage() {
    const { data, loading, error } = useUsuarios();

    if (loading) return <p>Cargando...</p>
    if (error) return <p>Error al cargar usuarios</p>

    return (
        <>
            <div className="flex-1 flex flex-col gap-6 w-full">
                {data?.map((member, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center text-center relative">
                        <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                        <div className="w-[64px] h-[64px] rounded-full bg-white/[0.02] border-2 border-dashed border-white/10 flex items-center justify-center mb-6">
                            <span className={`font-mono text-xl font-bold ${member.color}`}>{member.initials}</span>
                        </div>
                        <h3 className="font-mono text-base font-bold text-white mb-1">{member.nombre}</h3>
                        <span className="text-[11px] text-[#efc704] font-semibold uppercase tracking-wider mb-4">{member.rol_id}</span>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">{member.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className="text-[11px] bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded text-slate-300">{member.telefono}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}