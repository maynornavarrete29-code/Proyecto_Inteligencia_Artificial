import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from './api';
import { Use } from "./use";

export interface PagosCascadas {
    proyecto_id?: number;
    monto?: number;
    fecha_pago?: Date;
    [key: string]: any;
}

async function getPagosCascadas(): Promise<PagosCascadas[]> {
    return fetchAPI<PagosCascadas[]>(`/pagos_cascadas`,
        {
            method: 'GET',
            params: {
                pago_id: null
            }
        }
    );
}

export function usePagosCascadas() {
    const [state, setState] = useState<Use<PagosCascadas[]>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getPagosCascadas();
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

export async function createPagosCascadas(pago: PagosCascadas) {
    return fetchAPI<PagosCascadas>(`/pagos_cascadas`, {
        method: 'POST',
        body: JSON.stringify(pago),
    });
}