import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import AppNavigation from './AppNavigation'; 
import { initializeDatabase } from './frontend/src/db/database';

export default function App() {
  return (
    //SQLite
    <SQLiteProvider databaseName="tiendida.db" onInit={initializeDatabase}>
      <AppNavigation />
    </SQLiteProvider>
  );
}