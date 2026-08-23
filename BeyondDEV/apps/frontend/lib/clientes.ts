import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface Cliente {
    nombre?: string;
    telefono?: string;
    email?: string;
    fecha_creacion?: Date;
    [key: string]: any;
}

async function getClientes(): Promise<Cliente[]> {
    return fetchAPI<Cliente[]>(`/clientes`,
        {
            method: 'GET',
            params: {
                proyecto_id: null
            }
        }
    );
}

export function useClientes() {
    const [state, setState] = useState<Use<Cliente[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getClientes();
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

export async function createCliente(cliente: Cliente) {
    return fetchAPI<Cliente>(`/clientes`, {
        method: 'POST',
        body: JSON.stringify(cliente),
    });
}