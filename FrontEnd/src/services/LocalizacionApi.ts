// src/api/LocalizacionApi.ts
export interface Pais {
    id: number;
    nombre: string;
    eliminado: boolean;
}

export interface Provincia {
    id: number;
    nombre: string;
    eliminado: boolean;
    pais: Pais;
}

export interface Localidad {
    id: number;
    nombre: string;
    eliminado: boolean;
    provincia: Provincia;
}

const BASE_URL = "http://localhost:8080/api";

export const getPaises = async (): Promise<Pais[]> => {
    const res = await fetch(`${BASE_URL}/pais`);
    return res.json();
};

export const getProvincias = async (): Promise<Provincia[]> => {
    const res = await fetch(`${BASE_URL}/provincia`);
    return res.json();
};

export const getLocalidades = async (): Promise<Localidad[]> => {
    const res = await fetch(`${BASE_URL}/localidad`);
    return res.json();
};
