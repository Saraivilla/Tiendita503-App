import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';

// Pantallas
import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import DataEntryScreen from '../screens/DataEntryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Navegación por Pestañas (Tab Navigator) ---
import BottomNavBar from '../components/BottomNavBar';

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="InicioTab" component={HomeScreen} />
      <Tab.Screen name="InventarioTab" component={ListScreen} />
      <Tab.Screen name="NuevoProductoTab" component={DataEntryScreen} />
      <Tab.Screen name="PerfilTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- Navegador Raíz (Stack Navigator) ---
export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (e) {
        console.error('Error verificando token:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {/* Contenedor Principal de Frames */}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            
            {/* Pantalla modal/stack para Edición de Productos */}
            <Stack.Screen 
              name="DataEntry" 
              component={DataEntryScreen} 
              options={{
                headerShown: true,
                title: 'Editar Producto',
                headerTintColor: '#2E7D32',
                headerStyle: { backgroundColor: '#F9FBF8' },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}