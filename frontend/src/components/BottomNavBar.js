import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomNavBar() {
  const navigation = useNavigation();
  const route = useRoute();

  // Definición de las rutas del menú inferior
  const tabs = [
    {
      name: 'InicioTab',
      label: 'Inicio',
      activeIcon: 'home',
      inactiveIcon: 'home-outline',
    },
    {
      name: 'InventarioTab',
      label: 'Productos',
      activeIcon: 'list',
      inactiveIcon: 'list-outline',
    },
    {
      name: 'NuevoProductoTab',
      label: 'Agregar',
      activeIcon: 'add-circle',
      inactiveIcon: 'add-circle-outline',
    },
    {
      name: 'PerfilTab',
      label: 'Perfil',
      activeIcon: 'person',
      inactiveIcon: 'person-outline',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isFocused = route.name === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={isFocused ? tab.activeIcon : tab.inactiveIcon}
              size={22}
              color={isFocused ? '#2E7D32' : '#888888'}
            />
            <Text style={[styles.tabLabel, { color: isFocused ? '#2E7D32' : '#888888' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 10 : 4,
    paddingTop: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});