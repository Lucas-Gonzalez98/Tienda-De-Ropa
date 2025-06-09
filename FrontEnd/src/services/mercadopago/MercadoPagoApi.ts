import Pedido from "../../models/Pedido";
import PreferenceMP from "../../models/mercadopago/PreferenceMP";
import { useAuthedFetch } from "./TokenApis"; // <-- ¡Asegúrate de importar esto!

export function useSavePreferenceMP() {
    const authedFetch = useAuthedFetch();

    // Retornamos una función asíncrona que usa authedFetch
    return async (pedido?: Pedido) => {
        const endpoint = 'http://localhost:8080/api/pedido/create_preference_mp';
        const response = await authedFetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (!response.ok) {
            // Manejo de error (puedes mejorar esto)
            throw new Error("Error al guardar la preferencia MercadoPago");
        }

        const json = await response.json();
        return json as PreferenceMP;
    }
}