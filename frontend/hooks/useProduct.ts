import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import { fetchProducts, createProduct, deleteProduct, fetchProductById } from '../services/api';

interface UseProductsHook {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProductsData: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
    removeProduct: (id: number) => Promise<boolean>;
    getProductDetails: (id: number) => Promise<Product | null>;
}

export const useProducts = (): UseProductsHook => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err: any) {
            console.error("Error fetching products:", err);
            setError(err.message || 'Error al cargar productos.');
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<boolean> => {
        try {
            const result = await createProduct(product);
            console.log(result.message);
            await fetchProductsData(); 
            return true;
        } catch (err: any) {
            console.error("Error adding product:", err);
            setError(err.message || 'Error al añadir producto.');
            return false;
        }
    }, [fetchProductsData]);

    const removeProduct = useCallback(async (id: number): Promise<boolean> => {
        try {
            const result = await deleteProduct(id);
            console.log(result.message);
            setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
            return true;
        } catch (err: any) {
            console.error(`Error deleting product with ID ${id}:`, err);
            setError(err.message || 'Error al eliminar producto.');
            return false;
        }
    }, []);

    const getProductDetails = useCallback(async (id: number): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProductById(id);
            return data;
        } catch (err: any) {
            console.error(`Error fetching product details for ID ${id}:`, err);
            setError(err.message || 'Error al obtener detalles del producto.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductsData();
    }, [fetchProductsData]);

    return { products, loading, error, fetchProductsData, addProduct, removeProduct, getProductDetails };
};
