import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Product } from '../types/product';

interface ProductDetailModalProps {
    isVisible: boolean;
    product: Product | null;
    onClose: () => void;
    onDelete: (id: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isVisible, product, onClose, onDelete }) => {
    if (!product) {
        return null; 
    }

    const handleDeletePress = () => {
        if (product.id) {
            onDelete(product.id);
            onClose(); 
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Detalle del Producto</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        {/* Image of the product */}
                        <Image
                            source={{ uri: product.url_fotografia || 'https://placehold.co/200x200/CCCCCC/000000?text=No+Img' }}
                            style={styles.productImage}
                            onError={(e) => console.log('Error loading detail image:', e.nativeEvent.error)}
                        />
                        <Text style={styles.detailLabel}>Nombre:</Text>
                        <Text style={styles.detailText}>{product.nombre}</Text>

                        <Text style={styles.detailLabel}>Descripción:</Text>
                        <Text style={styles.detailText}>{product.descripcion}</Text>

                        <Text style={styles.detailLabel}>Precio:</Text>
                        <Text style={styles.detailText}>${product.precio.toFixed(2)}</Text>

                        <Text style={styles.detailLabel}>Estado:</Text>
                        <Text style={styles.detailText}>{product.estado ? 'Disponible' : 'No Disponible'}</Text>

                        <Text style={styles.detailLabel}>Categoría:</Text>
                        <Text style={styles.detailText}>{product.categoria}</Text>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeletePress}
                    >
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.closeButton]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', 
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '80%', 
    },
    scrollViewContent: {
        width: '100%',
        alignItems: 'flex-start', 
        paddingBottom: 20, 
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 100, 
        marginBottom: 20,
        alignSelf: 'center', 
        resizeMode: 'cover',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#555',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#2196F3',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default ProductDetailModal;
