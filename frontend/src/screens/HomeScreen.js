import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Categorías del inventario
const Categories = [
  { id: '1', name: 'Frutas y\nverduras', icon: 'nutrition', library: 'Ionicons', color: '#EAF8EA', iconColor: '#2E7D32' },
  { id: '2', name: 'Bebidas', icon: 'bottle-wine-outline', library: 'MaterialCommunityIcons', color: '#E3F2FD', iconColor: '#2196F3' },
  { id: '3', name: 'Snacks', icon: 'cookie', library: 'MaterialCommunityIcons', color: '#FFF3E0', iconColor: '#FF9800' },
  { id: '4', name: 'Higiene y\nlimpieza', icon: 'spray-bottle', library: 'MaterialCommunityIcons', color: '#E1F5FE', iconColor: '#03A9F4' },
  { id: '5', name: 'Lácteos', icon: 'cup-water', library: 'MaterialCommunityIcons', color: '#E8EAF6', iconColor: '#3F51B5' },
  { id: '6', name: 'Ver Todos', icon: 'grid-outline', library: 'Ionicons', color: '#F3E5F5', iconColor: '#9C27B0' },
];

// Datos de muestra
const Recent_Inventory = [
  { id: '101', name: 'Plátano', price: '$0.25', stock: 45, icon: 'leaf-outline', iconColor: '#2E7D32', bgColor: '#EAF8EA' },
  { id: '102', name: 'Gatorade 500ml', price: '$1.25', stock: 12, icon: 'wine-outline', iconColor: '#2196F3', bgColor: '#E3F2FD' },
  { id: '103', name: 'Pan Bimbo', price: '$1.10', stock: 5, icon: 'fast-food-outline', iconColor: '#FF9800', bgColor: '#FFF3E0' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
  Alert.alert(
    'Cerrar Sesión',
    '¿Estás seguro de que deseas salir?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['token', 'user']);
          navigation.replace('Login');
        },
      },
    ]
  );
};

  const renderCategoryIcon = (item) => {
    if (item.library === 'Ionicons') {
      return <Ionicons name={item.icon} size={24} color={item.iconColor} />;
    }
    return <MaterialCommunityIcons name={item.icon} size={24} color={item.iconColor} />;
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('list', { productId: item.id, itemData: item })}
    >
      <View style={[styles.productIconBox, { backgroundColor: item.bgColor || '#F5F5F5' }]}>
        <Ionicons name={item.icon || 'cube-outline'} size={32} color={item.iconColor || '#2E7D32'} />
      </View>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <Text style={[styles.stockText, item.stock <= 5 ? styles.lowStockText : null]}>
        Stock: {item.stock} u.
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FBF8" />
      
      {/* Header Superior */}
      <View style={styles.topHeaderWrapper}>
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo-tiendita.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>Control de Inventario</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.profileIconButton} 
            onPress={() => navigation.navigate('profile')} 
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={20} color="#2E7D32" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutIconButton} onPress={handleLogout} activeOpacity={0.7}>
            <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido Principal */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Saludo principal */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>¡Hola, {user || 'Usuario'}!</Text>
          <Text style={styles.greetingSubtitle}>Resumen general del stock hoy</Text>
        </View>

        {/* Tarjetas de Métricas */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#EAF8EA' }]}>
              <Ionicons name="cube-outline" size={18} color="#2E7D32" />
            </View>
            <Text style={styles.metricNumber}>124</Text>
            <Text style={styles.metricLabel}>Total Productos</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="alert-circle-outline" size={18} color="#D32F2F" />
            </View>
            <Text style={[styles.metricNumber, { color: '#D32F2F' }]}>8</Text>
            <Text style={styles.metricLabel}>Bajo Stock</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="grid-outline" size={18} color="#1976D2" />
            </View>
            <Text style={[styles.metricNumber, { color: '#1976D2' }]}>6</Text>
            <Text style={styles.metricLabel}>Categorías</Text>
          </View>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por código o producto..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categorías */}
        <Text style={styles.sectionTitle}>Filtrar por Categoría</Text>
        <View style={styles.CategoriesGrid}>
          {Categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('list', { categoryId: cat.id })}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.color }]}>
                {renderCategoryIcon(cat)}
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner de Acción Rápida */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>¿Nuevo ingreso de stock?</Text>
            <Text style={styles.bannerDescription}>
              Registra nuevos productos en tu base de datos local.
            </Text>
            <TouchableOpacity 
              style={styles.bannerButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('form')}
            >
              <Text style={styles.bannerButtonText}>+ Agregar Producto</Text>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons name="package-variant-closed" size={60} color="#2E7D32" />
        </View>

        {/* Productos Recientes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registrados recientemente</Text>
          <TouchableOpacity onPress={() => navigation.navigate('list')}>
            <Text style={styles.seeAllText}>Ver lista</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={Recent_Inventory}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FBF8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 8,
  },
  topHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    backgroundColor: '#F9FBF8',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF8EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoutIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 100, 
  },
  greetingContainer: {
    marginTop: 8,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  greetingSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  metricIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  metricLabel: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginTop: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4332',
    marginTop: 22,
    marginBottom: 12,
  },
  CategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#444444',
    lineHeight: 15,
  },
  bannerContainer: {
    backgroundColor: '#EAF8EA',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bannerDescription: {
    fontSize: 12,
    color: '#4F6D54',
    marginVertical: 4,
  },
  bannerButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '700',
  },
  productsList: {
    paddingRight: 10,
    paddingVertical: 4,
  },
  productCard: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productIconBox: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 2,
  },
  stockText: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },
  lowStockText: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    left: 18,
    right: 18,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EAF0EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#757575',
    marginTop: 2,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  navAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    ...Platform.select({
      ios: {
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});