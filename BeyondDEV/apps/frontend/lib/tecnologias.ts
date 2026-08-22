import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface Tecnologia {
    proyecto_id?: number;
    nombre?: string;
    descripcion?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    estado_proyecto?: string;
    presupuesto?: number;
    [key: string]: any;
}

async function getTecnologias(): Promise<Tecnologia[]> {
    return fetchAPI<Tecnologia[]>(`/tecnologias`,
        {
            method: 'GET',
            params: {
                proyecto_id: null
            }
        }
    );
}

export function useTecnologias() {
    const [state, setState] = useState<Use<Tecnologia[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getTecnologias();
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

export async function createTecnologia(tecnologia: Tecnologia) {
    return fetchAPI<Tecnologia>(`/tecnologias`, {
        method: 'POST',
        body: JSON.stringify(tecnologia),
    });
}