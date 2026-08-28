import { fetchAPI, API_BASE_URL } from "./api";
import { useState, useEffect, useCallback } from "react";
import { Use } from "./use";

interface AuthResponse {
    access_token: string;
    token_type: string;
    usuario_id: number;
    nombre: string;
    email: string;
    rol_id: number;
}

export interface Usuario {
    rol_id?: number;
    nombre?: string
    telefono?: string
    email?: string
    hashed_password?: string
    fecha_creacion?: Date
    [key: string]: any;
}

export interface LoggedUser {
    usuario_id: number;
    nombre: string;
    email: string;
    rol_id: number;
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

export async function login({ email, hashed_password }: { email: string, hashed_password: string }) {
    const result = await fetchAPI<AuthResponse>("/usuarios/login", {
        method: 'POST',
        body: JSON.stringify({ email, hashed_password })
    });

    if (typeof window !== "undefined") {
        localStorage.setItem("beyonddev_token", result.access_token);
        localStorage.setItem("beyonddev_user", JSON.stringify({
            usuario_id: result.usuario_id,
            nombre: result.nombre,
            email: result.email,
            rol_id: result.rol_id
        }));
    }
    return result;
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("beyonddev_token");
        localStorage.removeItem("beyonddev_user");
    }
}

export function getCurrentUser(): LoggedUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("beyonddev_user");
    if (!raw) return null;
    try {
        return JSON.parse(raw) as LoggedUser;
    } catch {
        return null;
    }
}

export function getAccessToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("beyonddev_token");
}
