import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { Hero, Row, Button, Badge, st } from '../ui';
import { colors } from '../theme';
import { EXAM_SQL } from '../db/database';
import { daysLeft, countdownLabel, countdownColor, formatDate, formatTime, endTime } from '../utils';

export default function ExamDetailScreen({ route, navigation }) {
  const db = useSQLiteContext();
  const { id } = route.params;
  const [e, setE] = useState(null);

  useFocusEffect(useCallback(() => {
    db.getFirstAsync(`${EXAM_SQL} WHERE e.id = ?`, [id]).then(setE);
  }, [db, id]));

  const toggleSaved = async () => {
    const next = e.is_saved ? 0 : 1;
    await db.runAsync('UPDATE exams SET is_saved = ? WHERE id = ?', [next, id]);
    setE({ ...e, is_saved: next });
  };

  const remove = () => Alert.alert('Delete exam', 'Remove this exam from your planner?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => {
      await db.runAsync('DELETE FROM exams WHERE id = ?', [id]);
      navigation.goBack();
    } },
  ]);

  if (!e) return null;
  const d = daysLeft(e.exam_date);

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <Hero title={e.title} subtitle={`${e.code} • ${e.department}`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, minWidth: 96, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: d === 0 ? 24 : 36, fontWeight: '900', color: countdownColor(d) }}>
              {d < 0 ? '✓' : d === 0 ? 'TODAY' : d}
            </Text>
            <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 12 }}>
              {d < 0 ? 'Completed' : d === 0 ? "Exam day!" : d === 1 ? 'day to go' : 'days to go'}
            </Text>
          </View>
          <View style={{ marginLeft: 14 }}>
            <Badge label={countdownLabel(d)} color={countdownColor(d)} />
            <Text style={{ color: '#fff', marginTop: 8, fontWeight: '600' }}>{formatDate(e.exam_date)}</Text>
          </View>
        </View>
      </Hero>

      <View style={st.box}>
        <Row icon="🕘" label="Time" value={`${formatTime(e.start_time)} - ${formatTime(endTime(e.start_time, e.duration_min))}  (${e.duration_min} min)`} />
        <Row icon="🏛️" label="Exam hall" value={`${e.hall_name}, ${e.building}`} />
        <Row icon="🪜" label="Floor" value={e.floor} />
        <Row icon="💺" label="Seat range" value={e.seat_range || '-'} />
        <Row icon="🧑‍🏫" label="Invigilator" value={e.inv_name} />
        <Row icon="📌" label="Instructions" value={e.instructions || '-'} />
      </View>

      <View style={{ marginHorizontal: 14 }}>
        <Button title={e.is_saved ? '★ Remove from My Exams' : '☆ Add to My Exams'} onPress={toggleSaved} color={colors.accent} />
        <Button outline title="🏛️ View hall & directions" onPress={() => navigation.navigate('HallDetail', { id: e.hall_id })} />
        <Button outline title="🧑‍🏫 View invigilator" onPress={() => navigation.navigate('InvigilatorDetail', { id: e.invigilator_id })} />
        <Button title="🗑 Delete exam" onPress={remove} color={colors.danger} />
      </View>
    </ScrollView>
  );
}
