import React, { useEffect, useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Validación de Token
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        navigation.replace('MainTabs');
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    // Validación de campos
    if (user && password) {
      await AsyncStorage.setItem('user', user);
      await AsyncStorage.setItem('token', 'secure-token-1234');

      navigation.replace('MainTabs');
    } else {
      alert('Debe ingresar usuario y contraseña');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo-tiendita.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>
            ¡Bienvenido!
          </Text>

          <Text style={styles.subtitle}>
            Ingresa para continuar
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>

          {/* Usuario */}
          <Text style={styles.label}>
            Usuario
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={22}
              color={colors.muted}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="user123"
              placeholderTextColor={colors.muted}
              value={user}
              onChangeText={setUser}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Contraseña */}
          <Text style={[styles.label, styles.passwordLabel]}>
            Contraseña
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={colors.muted}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Recuperar contraseña */}
          <TouchableOpacity
            style={styles.forgotContainer}
          >
            <Text style={styles.forgotText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* Botón Login */}
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>
              Ingresar
            </Text>

            <Ionicons
              name="arrow-forward"
              size={22}
              color={colors.onPrimary}
            />
          </TouchableOpacity>

          {/* Separador */}
          <View style={styles.separatorContainer}>
            <View style={styles.separator} />

            <Text style={styles.separatorText}>
              o
            </Text>

            <View style={styles.separator} />
          </View>

          {/* Registro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              ¿No tienes una cuenta?
            </Text>

            <TouchableOpacity>
              <Text style={styles.registerLink}>
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  /*
   * LOGO
   */
  logo:{
    width: 150,
    height: 150,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 35,
  },

  /*
   * HEADER
   */
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 17,
    color: colors.muted,
  },

  /*
   * FORMULARIO
   */
  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },

  passwordLabel: {
    marginTop: 18,
  },

  inputContainer: {
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colors.text,
  },

  /*
   * RECUPERAR CONTRASEÑA
   */
  forgotContainer: {
    alignItems: 'center',
    marginTop: 12,
  },

  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  /*
   * LOGIN
   */
  loginButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: colors.onPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginRight: 10,
  },

  /*
   * SEPARADOR
   */
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  separatorText: {
    marginHorizontal: 15,
    color: colors.muted,
    fontSize: 14,
  },

  /*
   * REGISTRO
   */
  registerContainer: {
    alignItems: 'center',
    marginTop: 28,
  },

  registerText: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 5,
  },

  registerLink: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default LoginScreen;