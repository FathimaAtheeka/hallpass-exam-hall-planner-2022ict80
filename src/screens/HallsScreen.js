import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { st, SearchBar, Chips, ListCard, Empty } from '../ui';

export default function HallsScreen({ navigation }) {
  const db = useSQLiteContext();
  const [halls, setHalls] = useState([]);
  const [q, setQ] = useState('');
  const [building, setBuilding] = useState('All');

  useEffect(() => {
    db.getAllAsync('SELECT * FROM halls ORDER BY name').then(setHalls);
  }, [db]);

  const buildings = ['All', ...Array.from(new Set(halls.map((h) => h.building)))];
  const data = halls.filter((h) =>
    h.name.toLowerCase().includes(q.toLowerCase()) && (building === 'All' || h.building === building));

  return (
    <View style={st.screen}>
      <SearchBar value={q} onChangeText={setQ} placeholder="Search exam halls..." />
      <Chips options={buildings} selected={building} onSelect={setBuilding} />
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        ListEmptyComponent={<Empty icon="🏛️" text="No halls found." />}
        renderItem={({ item }) => (
          <ListCard icon="🏛️" title={item.name} subtitle={`${item.building} • ${item.floor}`}
            meta={`Capacity: ${item.capacity} seats`}
            onPress={() => navigation.navigate('HallDetail', { id: item.id })} />
        )}
      />
    </View>
  );
}
