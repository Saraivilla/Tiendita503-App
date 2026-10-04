import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import AppNavigation from './AppNavigation'; 
import { initializeDatabase } from './frontend/src/db/database';
import { ThemeProvider } from './frontend/src/context/ThemeContext';

export default function App() {
  return (
    //SQLite
    <SQLiteProvider databaseName="tiendida.db" onInit={initializeDatabase}>
      <ThemeProvider>
      <AppNavigation />
      </ThemeProvider>
    </SQLiteProvider>
  );
}