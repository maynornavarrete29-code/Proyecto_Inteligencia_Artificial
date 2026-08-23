import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface Rol {
    rol_id?: number;
    tipo?: string;
    descripcion?: string;
    [key: string]: any;
}

async function getRoles(): Promise<Rol[]> {
    return fetchAPI<Rol[]>(`/roles`,
        {
            method: 'GET',
            params: {
                rol_id: null
            }
        }
    );
}

export function useRoles() {
    const [state, setState] = useState<Use<Rol[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getRoles();
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

export async function createRol(rol: Rol) {
    return fetchAPI<Rol>(`/roles`, {
        method: 'POST',
        body: JSON.stringify(rol),
    });
}