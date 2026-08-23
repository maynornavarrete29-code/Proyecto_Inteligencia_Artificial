import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface Comentarios {
    descripcion?: string;
    usuario_id?: number;
    fecha_creacion?: Date;
    [key: string]: any;
}

async function getComentarios(): Promise<Comentarios[]> {
    return fetchAPI<Comentarios[]>(`/comentarios`,
        {
            method: 'GET',
            params: {
                comentario_id: null
            }
        }
    );
}

export function useComentarios() {
    const [state, setState] = useState<Use<Comentarios[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getComentarios();
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

export async function createComentario(comentario: Comentarios) {
    return fetchAPI<Comentarios>(`/comentarios`, {
        method: 'POST',
        body: JSON.stringify(comentario),
    });
}