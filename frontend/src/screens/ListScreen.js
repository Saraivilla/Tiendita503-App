import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useTheme } from "../context/ThemeContext";

export default function ListScreen({ navigation }) {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const rows = await db.getAllAsync(
        "SELECT * FROM products ORDER BY name COLLATE NOCASE ASC",
      );
      setProducts(rows);
    };

    loadProducts();
    const unsubscribe = navigation.addListener("focus", loadProducts);
    return unsubscribe;
  }, [db, navigation]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q),
      )
    : products;

  const renderItem = ({ item }) => {
    const low = item.stock <= item.minStock;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("MainTabs", { id: item.id })}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="cube-outline" size={24} color={colors.primary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {item.sku}
            {item.category ? `  ·  ${item.category}` : ""}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
          <View style={[styles.badge, low && styles.badgeLow]}>
            <Text style={[styles.badgeText, low && styles.badgeTextLow]}>
              {low ? "Bajo: " : "Stock: "}
              {item.stock}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventario</Text>
          <Text style={styles.subtitle}>
            {products.length} producto{products.length === 1 ? "" : "s"}
          </Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, SKU o categoría"
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="basket-outline" size={56} color={colors.border} />
            <Text style={styles.emptyTitle}>
              {search ? "Sin resultados" : "Aún no tienes productos"}
            </Text>
            <Text style={styles.emptyText}>
              {search
                ? "Prueba con otra búsqueda."
                : "Toca el botón + para agregar el primero."}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("form")}
      >
        <Ionicons name="add" size={32} color={colors.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 2 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  listContent: { paddingHorizontal: 20, paddingBottom: 110, flexGrow: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  sub: { fontSize: 13, color: colors.muted, marginTop: 3 },
  right: { alignItems: "flex-end" },
  price: { fontSize: 16, fontWeight: "800", color: colors.primary },
  badge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.soft,
  },
  badgeLow: { backgroundColor: colors.dangerSoft },
  badgeText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  badgeTextLow: { color: colors.danger },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginTop: 12,
  },
  emptyText: { fontSize: 14, color: colors.muted, marginTop: 4 },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 28,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});