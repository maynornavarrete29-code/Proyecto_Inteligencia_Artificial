import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface StackProyecto {
    proyecto_id?: number;
    nombre?: string;
    descripcion?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    estado_proyecto?: string;
    presupuesto?: number;
    [key: string]: any;
}

async function getStackProyectos(): Promise<StackProyecto[]> {
    return fetchAPI<StackProyecto[]>(`/stack_proyectos`,
        {
            method: 'GET',
            params: {
                stack_proyecto_id: null
            }
        }
    );
}

export function useProyectos() {
    const [state, setState] = useState<Use<StackProyecto[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getStackProyectos();
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

export async function createProyecto(proyecto: StackProyecto) {
    return fetchAPI<StackProyecto>(`/proyectos`, {
        method: 'POST',
        body: JSON.stringify(proyecto),
    });
}