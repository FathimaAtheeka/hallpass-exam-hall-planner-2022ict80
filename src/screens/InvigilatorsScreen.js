import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { st, SearchBar, Chips, ListCard, Empty } from '../ui';
import { DEPARTMENTS } from '../utils';

export default function InvigilatorsScreen({ navigation }) {
  const db = useSQLiteContext();
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('All');
  const [data, setData] = useState([]);

  useFocusEffect(useCallback(() => {
    let sql = `SELECT v.*, (SELECT COUNT(*) FROM exams e WHERE e.invigilator_id = v.id) AS cnt
               FROM invigilators v WHERE v.name LIKE ?`;
    const params = [`%${q}%`];
    if (dept !== 'All') { sql += ' AND v.department = ?'; params.push(dept); }
    db.getAllAsync(sql + ' ORDER BY v.name', params).then(setData);
  }, [db, q, dept]));

  return (
    <View style={st.screen}>
      <SearchBar value={q} onChangeText={setQ} placeholder="Search invigilators..." />
      <Chips options={['All', ...DEPARTMENTS]} selected={dept} onSelect={setDept} />
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        ListEmptyComponent={<Empty icon="🧑‍🏫" text="No invigilators found." />}
        renderItem={({ item }) => (
          <ListCard icon="🧑‍🏫" title={item.name} subtitle={item.department}
            meta={`${item.cnt} exam(s) assigned`}
            onPress={() => navigation.navigate('InvigilatorDetail', { id: item.id })} />
        )}
      />
    </View>
  );
}
