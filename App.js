import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/db/database';

export default function App() {
  return (
    <SQLiteProvider databaseName="examhall.db" onInit={initDatabase}>
      <StatusBar style="light" />
      <AppNavigator />
    </SQLiteProvider>
  );
}
