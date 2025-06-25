import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { Product } from '../types/product';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // Import Expo ImagePicker

interface ProductFormProps {
    initialProduct?: Product; // Optional for pre-filling if it's an edit
    onSubmit: (product: Omit<Product, 'id'>) => Promise<boolean>;
    buttonText: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onSubmit, buttonText }) => {
    const [nombre, setNombre] = useState(initialProduct?.nombre || '');
    const [descripcion, setDescripcion] = useState(initialProduct?.descripcion || '');
    const [precio, setPrecio] = useState(initialProduct?.precio?.toString() || '');
    const [estado, setEstado] = useState(initialProduct?.estado ?? true); // Default to true (Available)
    const [categoria, setCategoria] = useState(initialProduct?.categoria || 'Electrónica');
    const [urlFotografia, setUrlFotografia] = useState(initialProduct?.url_fotografia || '');

    // Camera/gallery permissions
    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
            Alert.alert(
                'Permisos Requeridos',
                'Necesitamos permiso para acceder a tu cámara y galería para cargar fotos.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setUrlFotografia(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setUrlFotografia(result.assets[0].uri);
        }
    };


    const handleSubmit = async () => {
        if (!nombre || !descripcion || !precio || !categoria || !urlFotografia) {
            Alert.alert('Error', 'Por favor, rellena todos los campos.');
            return;
        }

        const newProduct: Omit<Product, 'id'> = {
            nombre,
            descripcion,
            precio: parseFloat(precio),
            estado,
            categoria,
            url_fotografia: urlFotografia,
        };

        const success = await onSubmit(newProduct);
        if (success) {
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setEstado(true);
            setCategoria('Electrónica');
            setUrlFotografia('');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre del producto"
            />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Descripción del producto"
                multiline
            />

            <Text style={styles.label}>Precio:</Text>
            <TextInput
                style={styles.input}
                value={precio}
                onChangeText={(text) => setPrecio(text.replace(/[^0-9.]/g, ''))} // Only numbers and a dot
                placeholder="0.00"
                keyboardType="numeric"
            />

            <View style={styles.switchContainer}>
                <Text style={styles.label}>Estado:</Text>
                <Text style={{ marginRight: 10 }}>{estado ? 'Disponible' : 'No Disponible'}</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={estado ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setEstado}
                    value={estado}
                />
            </View>

            <Text style={styles.label}>Categoría:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={categoria}
                    onValueChange={(itemValue: string) => setCategoria(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Electrónica" value="Electrónica" />
                    <Picker.Item label="Ropa" value="Ropa" />
                    <Picker.Item label="Alimentos" value="Alimentos" />
                    <Picker.Item label="Hogar" value="Hogar" />
                    <Picker.Item label="Deportes" value="Deportes" />
                    <Picker.Item label="Otros" value="Otros" />
                </Picker>
            </View>

            <Text style={styles.label}>URL Fotografía:</Text>
            <TextInput
                style={styles.input}
                value={urlFotografia}
                onChangeText={setUrlFotografia}
                placeholder="https://example.com/foto.jpg"
                keyboardType="url"
            />

            <View style={styles.imagePickerButtons}>
                <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
                    <Text style={styles.buttonText}>Seleccionar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pickImageButton} onPress={takePhoto}>
                    <Text style={styles.buttonText}>Tomar Foto</Text>
                </TouchableOpacity>
            </View>
            {urlFotografia ? (
                <Text style={styles.imageUriText}>Foto seleccionada: {urlFotografia.substring(0, 40)}...</Text>
            ) : null}


            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{buttonText}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'space-between',
        paddingRight: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    imagePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    pickImageButton: {
        backgroundColor: '#6A5ACD', 
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    imageUriText: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginTop: -5,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductForm;
