import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { Hero, ExamCard, SectionTitle, Empty, st } from '../ui';
import { colors, shadow } from '../theme';
import { EXAM_SQL } from '../db/database';
import { localISO, daysLeft, formatDate, formatTime } from '../utils';

export default function HomeScreen({ navigation }) {
  const db = useSQLiteContext();
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState({ halls: 0, saved: 0 });

  useFocusEffect(useCallback(() => {
    (async () => {
      setUpcoming(await db.getAllAsync(`${EXAM_SQL} WHERE e.exam_date >= ? ORDER BY e.exam_date, e.start_time`, [localISO(0)]));
      const h = await db.getFirstAsync('SELECT COUNT(*) AS c FROM halls');
      const s = await db.getFirstAsync('SELECT COUNT(*) AS c FROM exams WHERE is_saved = 1');
      setStats({ halls: h.c, saved: s.c });
    })();
  }, [db]));

  const next = upcoming[0];
  const week = upcoming.filter((e) => daysLeft(e.exam_date) <= 7).slice(0, 4);
  const d = next ? daysLeft(next.exam_date) : 0;

  const Action = ({ icon, label, onPress }) => (
    <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={onPress}>
      <View style={[{ width: 58, height: 58, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, shadow]}>
        <Text style={{ fontSize: 26 }}>{icon}</Text>
      </View>
      <Text style={{ marginTop: 6, fontWeight: '700', color: colors.text, fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <Hero top emoji="🎓" title="HallPass" subtitle="Find your hall. Find your seat. Beat the clock.">
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>{upcoming.length}</Text>
            <Text style={{ color: '#D9D5F7', fontSize: 12 }}>Upcoming</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>{stats.saved}</Text>
            <Text style={{ color: '#D9D5F7', fontSize: 12 }}>My Exams</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>{stats.halls}</Text>
            <Text style={{ color: '#D9D5F7', fontSize: 12 }}>Halls</Text>
          </View>
        </View>
      </Hero>

      <SectionTitle>Next exam</SectionTitle>
      {next ? (
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ExamDetail', { id: next.id })}
          style={[st.box, { backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center' }]}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, width: 84, height: 84, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: d === 0 ? 20 : 34, fontWeight: '900', color: colors.primary }}>{d === 0 ? 'TODAY' : d}</Text>
            {d > 0 && <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 12 }}>{d === 1 ? 'day left' : 'days left'}</Text>}
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: colors.primaryDark }}>{next.title}</Text>
            <Text style={{ color: colors.primaryDark, marginTop: 3 }}>{next.code}</Text>
            <Text style={{ color: colors.primaryDark, marginTop: 6, fontWeight: '600' }}>📅 {formatDate(next.exam_date)}</Text>
            <Text style={{ color: colors.primaryDark, fontWeight: '600' }}>🕘 {formatTime(next.start_time)}  📍 {next.hall_name}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Empty icon="🎉" text="No upcoming exams. Tap + in the Exams tab to add one." />
      )}

      <SectionTitle>Quick actions</SectionTitle>
      <View style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: 10 }}>
        <Action icon="📝" label="Timetable" onPress={() => navigation.navigate('Exams')} />
        <Action icon="🏛️" label="Halls" onPress={() => navigation.navigate('Halls')} />
        <Action icon="🧑‍🏫" label="Invigilators" onPress={() => navigation.navigate('Invigilators')} />
        <Action icon="➕" label="Add Exam" onPress={() => navigation.navigate('AddExam')} />
      </View>

      <SectionTitle action="See all" onAction={() => navigation.navigate('Exams')}>This week</SectionTitle>
      {week.length === 0 && <Empty icon="😌" text="No exams in the next 7 days." />}
      {week.map((e) => (
        <ExamCard key={e.id} exam={e} onPress={() => navigation.navigate('ExamDetail', { id: e.id })} />
      ))}
    </ScrollView>
  );
}
