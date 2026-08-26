import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface Proyecto {
    proyecto_id?: number;
    cliente_id?: number;
    nombre?: string;
    descripcion?: string;
    prioridad?: string;
    tipo?: string;
    fecha_inicio?: string;
    entrega_propuesta?: string;
    presupuesto?: number;
    estado?: string;
    [key: string]: any;
}

async function getProyectos(): Promise<Proyecto[]> {
    return fetchAPI<Proyecto[]>(`/proyectos`,
        {
            method: 'GET',
            params: {
                proyecto_id: null
            }
        }
    );
}

export function useProyectos() {
    const [state, setState] = useState<Use<Proyecto[]>>({
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
    console.log("Proyecto a crear desde la API para el backend: ", proyecto);
    return fetchAPI<Proyecto>(`/proyectos`, {
        method: 'POST',
        body: JSON.stringify(proyecto),
    });
}