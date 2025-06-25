import React from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';

const ProductCreateScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { addProduct } = useProducts();

    const handleSubmit = async (newProduct: Omit<Product, 'id'>): Promise<boolean> => {
        try {
            const success = await addProduct(newProduct);
            if (success) {
                Alert.alert('Éxito', 'Producto creado exitosamente.');
                navigation.goBack(); 
                return true;
            }
            return false;
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo crear el producto.');
            return false;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Crear Nuevo Producto</Text>
                <ProductForm onSubmit={handleSubmit} buttonText="Guardar Producto" />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
});

export default ProductCreateScreen;
