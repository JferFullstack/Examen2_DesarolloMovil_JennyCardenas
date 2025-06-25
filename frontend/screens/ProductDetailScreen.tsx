import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { Product } from '../types/product';
import { useProducts } from '../hooks/useProduct';

type ProductDetailRouteParams = {
    productId: number;
};

type ProductDetailScreenRouteProp = RouteProp<Record<string, ProductDetailRouteParams>, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
    const route = useRoute<ProductDetailScreenRouteProp>();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { productId } = route.params;
    const { getProductDetails, removeProduct } = useProducts();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedProduct = await getProductDetails(productId);
                setProduct(fetchedProduct);
            } catch (err: any) {
                setError(err.message || 'Error al cargar los detalles del producto.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [productId, getProductDetails]);

    const handleDelete = async () => {
        if (!product?.id) return;

        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que quieres eliminar este producto?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        const success = await removeProduct(product.id!);
                        if (success) {
                            Alert.alert('Éxito', 'Producto eliminado correctamente.');
                            navigation.goBack(); 
                        } else {
                            Alert.alert('Error', 'No se pudo eliminar el producto.');
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando detalles del producto...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => { }}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Producto no encontrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{product.nombre}</Text>
                {/* Image of the product */}
                <Image
                    source={{ uri: product.url_fotografia || 'https://placehold.co/250x250/CCCCCC/000000?text=No+Img' }}
                    style={styles.productImage}
                    onError={(e) => console.log('Error loading detail image:', e.nativeEvent.error)}
                />

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Descripción:</Text>
                    <Text style={styles.value}>{product.descripcion}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Precio:</Text>
                    <Text style={styles.value}>${product.precio.toFixed(2)}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Estado:</Text>
                    <Text style={styles.value}>{product.estado ? 'Disponible' : 'No Disponible'}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Categoría:</Text>
                    <Text style={styles.value}>{product.categoria}</Text>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Eliminar Producto</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    productImage: {
        width: 250,
        height: 250,
        borderRadius: 125, 
        marginBottom: 25,
        resizeMode: 'cover',
        borderWidth: 3,
        borderColor: '#ddd',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 17,
        fontWeight: '600',
        color: '#555',
        flex: 1,
    },
    value: {
        fontSize: 17,
        color: '#333',
        flex: 2,
        textAlign: 'right',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;
