import { Product } from '../types/product';

// Asegúrate de que esta URL coincida con la dirección IP de tu máquina si estás
// probando en un dispositivo físico, o 'localhost' si usas un emulador en la misma máquina.
// Si usas el emulador Android Studio, '10.0.2.2' suele ser la IP de tu máquina host.
// Si usas el simulador iOS, 'localhost' o '127.0.0.1' funciona.
// Si usas tu IP local (ej. 192.168.1.X), asegúrate de que tu dispositivo esté en la misma red.
const API_BASE_URL = 'http://localhost:3000'; 

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<{ id: number; message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: { id: number; message: string } = await response.json();
        return data;
    } catch (error) {
        console.error("Error al crear producto:", error);
        throw error;
    }
};

export const deleteProduct = async (id: number): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: { message: string } = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al eliminar producto con ID ${id}:`, error);
        throw error;
    }
};

export const fetchProductById = async (id: number): Promise<Product> => {
    try {
        const response = await fetch(`${API_BASE_URL}/productos/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Producto no encontrado.');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        throw error;
    }
};
