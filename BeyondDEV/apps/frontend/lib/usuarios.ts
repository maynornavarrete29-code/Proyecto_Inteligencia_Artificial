import { fetchAPI } from "./api";
import { useState, useEffect, useCallback } from "react";
import { Use } from "./use";

export interface Usuario {
    rol_id?: number;
    nombre?: string
    telefono?: string
    email?: string
    hashed_password?: string
    fecha_creacion?: Date
    [key: string]: any;
}

async function getUsuarios(): Promise<Usuario[]> {
    return fetchAPI<Usuario[]>(`/usuarios`, { method: 'GET' });
}

export function useUsuarios() {
    const [state, setState] = useState<Use<Usuario[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getUsuarios();
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

export async function createUsuario(usuario: Usuario) {
    return fetchAPI<Usuario>(`/usuarios`, {
        method: 'POST',
        body: JSON.stringify(usuario),
    });
}


