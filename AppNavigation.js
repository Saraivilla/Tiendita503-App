import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomNavBar from './frontend/src/components/BottomNavBar';
import HomeScreen from './frontend/src/screens/HomeScreen';
import ListScreen from './frontend/src/screens/ListScreen';
import DataEntryScreen from './frontend/src/screens/DataEntryScreen';
import ProfileScreen from './frontend/src/screens/ProfileScreen'; 
import LoginScreen from './frontend/src/screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="list" component={ListScreen} />
      <Tab.Screen name="form" component={DataEntryScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navegador Principal del Stack
export default function AppNavigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (e) {
        console.error('Error al verificar sesión:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FBF8' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        
        {/* Pantalla de formulario presentada como Modal */}
        <Stack.Screen 
          name="form" 
          component={DataEntryScreen} 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: true,
            title: 'Registrar Producto',
            headerTintColor: '#2E7D32',
            headerStyle: { backgroundColor: '#F9FBF8' },
          }}
        />
        <Stack.Screen name="list" component={ListScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}