import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

// Datos Extra del Perfil en JSON
const PROFILE_KEY = "profile";
const EMPTY_PROFILE = { fullName: "", email: "", phone: "", store: "" };

export default function ProfileScreen({ navigation }) {
  const db = useSQLiteContext();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ total: 0, low: 0, categories: 0 });

  // Reinicia la navegación raíz hacia Login
  const goToLogin = useCallback(() => {
    const root = navigation.getParent() || navigation;
    root.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Login" }] }));
  }, [navigation]);

  // Al enfocar la pantalla: verificar sesión, cargar perfil y estadísticas
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          goToLogin(); 
          return;
        }
        const [user, raw] = await Promise.all([
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem(PROFILE_KEY),
        ]);
        const row = await db.getFirstAsync(
          `SELECT COUNT(*) AS total,
                  COALESCE(SUM(CASE WHEN stock <= minStock THEN 1 ELSE 0 END), 0) AS low,
                  COUNT(DISTINCT NULLIF(TRIM(category), '')) AS categories
           FROM products`
        );
        if (!active) return;
        setUsername(user || "");
        setProfile({ ...EMPTY_PROFILE, ...(raw ? JSON.parse(raw) : {}) });
        if (row) setStats(row);
      })();
      return () => {
        active = false;
      };
    }, [db, goToLogin])
  );

  // Guardar cambios del perfil
  const saveProfile = useCallback(async () => {
    const email = profile.email.trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Correo inválido", "Revisa el formato del correo electrónico.");
      return;
    }
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setEditing(false);
    Alert.alert("Listo", "Perfil actualizado correctamente.");
  }, [profile]);

  // Header personalizado: botón Editar / Guardar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={editing ? saveProfile : () => setEditing(true)}
          style={{ marginRight: 14 }}
        >
          <Ionicons
            name={editing ? "checkmark-circle" : "create-outline"}
            size={26}
            color={colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, editing, saveProfile, colors]);

  // Logout: limpia la sesión 
  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["token", "user", PROFILE_KEY]);
          goToLogin();
        },
      },
    ]);
  };

  const initial = (profile.fullName || username || "?").trim().charAt(0).toUpperCase();

  // Fila de dato (texto o input según modo edición)
  const renderField = (icon, label, key, keyboardType) => (
    <View style={styles.row} key={key}>
      <Ionicons name={icon} size={20} color={colors.primary} style={styles.rowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={profile[key]}
            onChangeText={(t) => setProfile((p) => ({ ...p, [key]: t }))}
            placeholder={label}
            placeholderTextColor={colors.muted}
            keyboardType={keyboardType}
            autoCapitalize={key === "email" ? "none" : "words"}
          />
        ) : (
          <Text style={styles.value}>{profile[key] || "Sin datos"}</Text>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{profile.fullName || username || "Usuario"}</Text>
          <Text style={styles.username}>@{username || "usuario"}</Text>
        </View>

        {/* Estadísticas desde SQLite */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.danger }]}>{stats.low}</Text>
            <Text style={styles.statLabel}>Bajo stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.categories}</Text>
            <Text style={styles.statLabel}>Categorías</Text>
          </View>
        </View>

        {/* Datos del perfil */}
        <View style={styles.card}>
          {renderField("person-outline", "Nombre completo", "fullName")}
          {renderField("mail-outline", "Correo", "email", "email-address")}
          {renderField("call-outline", "Teléfono", "phone", "phone-pad")}
          {renderField("storefront-outline", "Nombre de la tienda", "store")}
        </View>

        {/* Preferencias */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Ionicons
              name={isDark ? "moon" : "sunny-outline"}
              size={20}
              color={colors.primary}
              style={styles.rowIcon}
            />
            <Text style={[styles.value, { flex: 1 }]}>Modo oscuro</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={isDark ? colors.onPrimary : "#FFFFFF"}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos dependientes del tema
const makeStyles = (c) =>
  StyleSheet.create({
    container: { padding: 16, paddingBottom: 40 },
    header: { alignItems: "center", marginVertical: 18 },
    avatar: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: c.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    avatarText: { fontSize: 38, fontWeight: "bold", color: c.onPrimary },
    name: { fontSize: 22, fontWeight: "700", color: c.text },
    username: { fontSize: 14, color: c.muted, marginTop: 2 },
    statsRow: { flexDirection: "row", marginBottom: 16, gap: 10 },
    statCard: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
    },
    statNumber: { fontSize: 20, fontWeight: "700", color: c.primary },
    statLabel: { fontSize: 12, color: c.muted, marginTop: 2 },
    card: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    rowIcon: { marginRight: 14 },
    label: { fontSize: 12, color: c.muted, marginBottom: 2 },
    value: { fontSize: 16, color: c.text },
    input: {
      fontSize: 16,
      color: c.text,
      backgroundColor: c.input,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    switchRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
    logout: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: c.danger,
      borderRadius: 14,
      paddingVertical: 14,
      gap: 8,
    },
    logoutText: { fontSize: 16, fontWeight: "600", color: c.danger },
  });