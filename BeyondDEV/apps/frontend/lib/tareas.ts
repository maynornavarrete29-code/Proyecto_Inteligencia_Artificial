import { fetchAPI } from "@/lib/api";
import { useState, useEffect, useCallback } from 'react';
import { Use } from "@/lib/use";

export interface Tarea {
    tarea_id?: number;
    proyecto_id?: number;
    usuario_id?: number;
    titulo?: string;
    descripcion?: string;
    prioridad?: string;
    estado?: string;
    fecha_asignacion?: Date;
}

async function getTareas() {
    return await fetchAPI<Tarea[]>("/tareas", {
        method: "GET"
    });
}

export async function createTarea(data: Tarea) {
    return await fetchAPI<Tarea>("/tareas", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function useTareas() {
    const [state, setState] = useState<Use<Tarea[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getTareas();
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}