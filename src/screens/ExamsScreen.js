import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { st, SearchBar, Chips, ExamCard, Fab, Empty } from '../ui';
import { EXAM_SQL } from '../db/database';
import { daysLeft, DEPARTMENTS } from '../utils';

const PERIODS = ['All', 'Today', 'This Week', 'Upcoming', 'Past'];

function inPeriod(p, d) {
  if (p === 'Today') return d === 0;
  if (p === 'This Week') return d >= 0 && d <= 7;
  if (p === 'Upcoming') return d >= 0;
  if (p === 'Past') return d < 0;
  return true;
}

export default function ExamsScreen({ navigation }) {
  const db = useSQLiteContext();
  const [q, setQ] = useState('');
  const [period, setPeriod] = useState('All');
  const [dept, setDept] = useState('All');
  const [data, setData] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      let sql = `${EXAM_SQL} WHERE (e.title LIKE ? OR e.code LIKE ?)`;
      const params = [`%${q}%`, `%${q}%`];
      if (dept !== 'All') { sql += ' AND e.department = ?'; params.push(dept); }
      sql += ' ORDER BY e.exam_date, e.start_time';
      const rows = await db.getAllAsync(sql, params);
      setData(rows.filter((r) => inPeriod(period, daysLeft(r.exam_date))));
    })();
  }, [db, q, dept, period]));

  return (
    <View style={st.screen}>
      <SearchBar value={q} onChangeText={setQ} placeholder="Search by subject or code..." />
      <Chips options={PERIODS} selected={period} onSelect={setPeriod} />
      <Chips options={['All', ...DEPARTMENTS]} selected={dept} onSelect={setDept} />
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListEmptyComponent={<Empty icon="🔎" text="No exams match your search or filters." />}
        renderItem={({ item }) => (
          <ExamCard exam={item} onPress={() => navigation.navigate('ExamDetail', { id: item.id })} />
        )}
      />
      <Fab onPress={() => navigation.navigate('AddExam')} />
    </View>
  );
}
