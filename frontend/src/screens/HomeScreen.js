import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';


export default function HomeScreen() {

    const navigation = useNavigation();
    const [user, setUser] = useState('');

    useEffect(() =>{
        const loadUser = async() => {
            const storedUser = await AsyncStorage.getItem('user');
            if(storedUser){
                setUser(storedUser);
            }
        }
        loadUser();
    }, []);

    const handleLogout = async() =>{
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        navigation.replace('Login');

    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <TouchableOpacity style={styles.buttonDanger} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color ={'#fff'}/>
            <Text style={styles.buttonText}>Cerrar Sesion</Text>
       </TouchableOpacity>    
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});