import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../screens/ProductListScreen';
import ProductCreateScreen from '../screens/ProductCreateScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen'; 

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ProductList">
                <Stack.Screen
                    name="ProductList"
                    component={ProductListScreen}
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="ProductCreate"
                    component={ProductCreateScreen}
                    options={{ title: 'Crear Producto' }}
                />
                <Stack.Screen
                    name="ProductDetail"
                    component={ProductDetailScreen}
                    options={{ title: 'Detalle del Producto' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
