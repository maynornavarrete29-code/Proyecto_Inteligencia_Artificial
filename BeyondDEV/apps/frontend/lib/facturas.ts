import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface Factura {
    pago_id?: number;
    numero_factura?: string;
    fecha_creacion?: Date;
    [key: string]: any;
}

async function getFacturas(): Promise<Factura[]> {
    return fetchAPI<Factura[]>(`/facturas`,
        {
            method: 'GET',
            params: {
                factura_id: null
            }
        }
    );
}

export function useFacturas() {
    const [state, setState] = useState<Use<Factura[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getFacturas();
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

export async function createFactura(factura: Factura) {
    return fetchAPI<Factura>(`/facturas`, {
        method: 'POST',
        body: JSON.stringify(factura),
    });
}