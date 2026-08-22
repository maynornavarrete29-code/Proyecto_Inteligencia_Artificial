import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';

export interface Proyecto {
    proyecto_id?: number;
    nombre_proyecto?: string;
    descripcion?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    estado_proyecto?: string;
    [key: string]: any;
}

interface UseReporteState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export async function getProyectos(): Promise<Proyecto[]> {
    return fetchAPI<Proyecto[]>(`/proyectos`, { method: 'GET' });
}

export function useProyectos() {
    const [state, setState] = useState<UseReporteState<Proyecto[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getProyectos();
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

export async function createProyecto(proyecto: Proyecto) {
    return fetchAPI<Proyecto>(`/proyectos`, {
        method: 'POST',
        body: JSON.stringify(proyecto),
    });
}
