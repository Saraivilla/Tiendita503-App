// frontend/src/screens/DataEntryScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { colors } from "../theme";

function Field({ label, icon, style, multiline, ...props }) {
  return (
    <View style={[styles.fieldWrap, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, multiline && styles.inputBoxMultiline]}>
        <Ionicons name={icon} size={20} color={colors.muted} />
        <TextInput
          style={[styles.input, multiline && { textAlignVertical: "top" }]}
          placeholderTextColor={colors.muted}
          multiline={multiline}
          {...props}
        />
      </View>
    </View>
  );
}

export default function DataEntryScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const id = route.params?.id;
  const isEditing = !!id;

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      const p = await db.getFirstAsync("SELECT * FROM products WHERE id = ?", [
        id,
      ]);
      if (p) {
        setName(p.name);
        setSku(p.sku);
        setCategory(p.category || "");
        setPrice(String(p.price));
        setStock(String(p.stock));
        setMinStock(String(p.minStock));
        setNotes(p.notes || "");
      }
    })();
  }, [db, id, isEditing]);

  const toNumber = (v) => (v.trim() === "" ? 0 : Number(v.replace(",", ".")));

  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanSku = sku.trim().toUpperCase();

    if (!cleanName || !cleanSku) {
      Alert.alert("Faltan datos", "El nombre y el SKU son obligatorios.");
      return;
    }

    const priceNum = toNumber(price);
    const stockNum = toNumber(stock);
    const minStockNum = toNumber(minStock);

    if (!Number.isFinite(priceNum) || priceNum < 0) {
      Alert.alert("Precio inválido", "Ingresa un precio igual o mayor a 0.");
      return;
    }
    if (
      !Number.isInteger(stockNum) ||
      stockNum < 0 ||
      !Number.isInteger(minStockNum) ||
      minStockNum < 0
    ) {
      Alert.alert(
        "Stock inválido",
        "El stock y el stock mínimo deben ser números enteros.",
      );
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await db.runAsync(
          `UPDATE products
           SET name = ?, sku = ?, category = ?, price = ?, stock = ?, minStock = ?, notes = ?
           WHERE id = ?`,
          [
            cleanName,
            cleanSku,
            category.trim(),
            priceNum,
            stockNum,
            minStockNum,
            notes.trim(),
            id,
          ],
        );
      } else {
        await db.runAsync(
          `INSERT INTO products (name, sku, category, price, stock, minStock, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            cleanName,
            cleanSku,
            category.trim(),
            priceNum,
            stockNum,
            minStockNum,
            notes.trim(),
          ],
        );
      }
      navigation.goBack();
    } catch (e) {
      if (String(e.message).includes("UNIQUE")) {
        Alert.alert("SKU repetido", "Ya existe un producto con ese SKU.");
      } else {
        Alert.alert("Error", "No se pudo guardar el producto.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar producto",
      `¿Seguro que quieres eliminar "${name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await db.runAsync("DELETE FROM products WHERE id = ?", [id]);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Field
            label="Nombre"
            icon="pricetag-outline"
            placeholder="Ej. Agua 600ml"
            value={name}
            onChangeText={setName}
          />
          <Field
            label="SKU"
            icon="barcode-outline"
            placeholder="Ej. BEB-001"
            autoCapitalize="characters"
            value={sku}
            onChangeText={setSku}
          />
          <Field
            label="Categoría"
            icon="albums-outline"
            placeholder="Ej. Bebidas"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.row}>
            <Field
              style={{ flex: 1 }}
              label="Precio"
              icon="cash-outline"
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
            <View style={{ width: 12 }} />
            <Field
              style={{ flex: 1 }}
              label="Stock"
              icon="layers-outline"
              placeholder="0"
              keyboardType="number-pad"
              value={stock}
              onChangeText={setStock}
            />
          </View>

          <Field
            label="Stock mínimo (alerta)"
            icon="alert-circle-outline"
            placeholder="0"
            keyboardType="number-pad"
            value={minStock}
            onChangeText={setMinStock}
          />
          <Field
            label="Notas"
            icon="document-text-outline"
            placeholder="Opcional"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveText}>
              {isEditing ? "Guardar cambios" : "Guardar producto"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
              <Text style={styles.deleteText}>Eliminar producto</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.primary },
  form: { paddingHorizontal: 20, paddingBottom: 40 },
  row: { flexDirection: "row" },
  fieldWrap: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 26,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputBoxMultiline: {
    height: 110,
    alignItems: "flex-start",
    paddingTop: 14,
    borderRadius: 22,
  },
  input: { flex: 1, fontSize: 15, color: colors.text },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    marginTop: 10,
    borderRadius: 27,
    backgroundColor: colors.primary,
  },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    marginTop: 12,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.card,
  },
  deleteText: { color: colors.danger, fontSize: 15, fontWeight: "600" },
});
