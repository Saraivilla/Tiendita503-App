import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar({ state, descriptors, navigation }) {
  // Mapeo de configuración visual por ruta
  const tabConfig = {
    home: { label: 'Inicio', activeIcon: 'home', inactiveIcon: 'home-outline' },
    list: { label: 'Productos', activeIcon: 'list', inactiveIcon: 'list-outline' },
    form: { label: 'Agregar', activeIcon: 'add-circle', inactiveIcon: 'add-circle-outline' },
    profile: { label: 'Perfil', activeIcon: 'person', inactiveIcon: 'person-outline' },
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = tabConfig[route.name] || {
          label: route.name,
          activeIcon: 'ellipse',
          inactiveIcon: 'ellipse-outline',
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={onPress}
          >
            <Ionicons
              name={isFocused ? config.activeIcon : config.inactiveIcon}
              size={22}
              color={isFocused ? '#2E7D32' : '#888888'}
            />
            <Text style={[styles.tabLabel, { color: isFocused ? '#2E7D32' : '#888888' }]}>
              {config.label}
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
    height: Platform.OS === 'ios' ? 75 : 62,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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