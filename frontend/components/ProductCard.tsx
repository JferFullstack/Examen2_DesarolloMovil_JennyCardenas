import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onViewDetails: (id: number) => void;
    onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onDelete }) => {
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: product.url_fotografia || 'https://placehold.co/100x100/CCCCCC/000000?text=No+Img' }}
                style={styles.image}
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.nombre}</Text>
                <Text style={styles.description} numberOfLines={2}>{product.descripcion}</Text>
                <Text style={styles.price}>Precio: ${product.precio.toFixed(2)}</Text>
                <Text style={styles.status}>Estado: {product.estado ? 'Disponible' : 'No Disponible'}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => onViewDetails(product.id!)} // '!' because we know the ID exists here
                >
                    <Text style={styles.buttonText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(product.id!)}
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
        resizeMode: 'cover',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 2,
    },
    status: {
        fontSize: 14,
        color: '#888',
    },
    buttonsContainer: {
        marginLeft: 15,
        alignItems: 'center',
    },
    detailButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default ProductCard;
