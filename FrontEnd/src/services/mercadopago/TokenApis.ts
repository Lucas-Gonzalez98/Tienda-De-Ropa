import { useAuth } from "../../context/AuthContext";

export function useAuthedFetch() {
    const { usuario } = useAuth();
    return (url: string, options = {}) => {
        const headers = {
            ...(options as any).headers,
            ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
        };
        return fetch(url, { ...options, headers });
    };
}