import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { useProducts } from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../types/product';

const ProductListScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { products, loading, error, removeProduct, fetchProductsData, getProductDetails } = useProducts();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleViewDetails = async (id: number) => {
        const product = await getProductDetails(id);
        if (product) {
            setSelectedProduct(product);
            setModalVisible(true);
        } else {
            Alert.alert('Error', 'No se pudieron cargar los detalles del producto.');
        }
    };

    const handleDeleteProduct = (id: number) => {
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
                        const success = await removeProduct(id);
                        if (success) {
                            Alert.alert('Éxito', 'Producto eliminado correctamente.');
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
                <Text>Cargando productos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchProductsData}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Productos</Text>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('ProductCreate')}
            >
                <Text style={styles.createButtonText}>Crear Nuevo Producto</Text>
            </TouchableOpacity>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Fallback for key if id is undefined
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onViewDetails={handleViewDetails}
                        onDelete={handleDeleteProduct}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyListText}>No hay productos disponibles.</Text>}
            />

            <ProductDetailModal
                isVisible={modalVisible}
                product={selectedProduct}
                onClose={() => setModalVisible(false)}
                onDelete={handleDeleteProduct}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        paddingTop: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    createButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#777',
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

export default ProductListScreen;
