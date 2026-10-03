import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SQLiteProvider } from "expo-sqlite";

import LoginScreen from "./frontend/src/screens/LoginScreen";
import HomeScreen from "./frontend/src/screens/HomeScreen";
import DataEntryScreen from "./frontend/src/screens/DataEntryScreen";
import ListScreen from "./frontend/src/screens/ListScreen";
import { initializeDatabase } from "./frontend/src/db/database";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SQLiteProvider databaseName="tiendida.db" onInit={initializeDatabase}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DataEntry" component={DataEntryScreen} />
          <Stack.Screen name="List" component={ListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
