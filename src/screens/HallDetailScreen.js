import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { Hero, Row, ExamCard, SectionTitle, Empty, st } from '../ui';
import { EXAM_SQL } from '../db/database';

export default function HallDetailScreen({ route, navigation }) {
  const db = useSQLiteContext();
  const [hall, setHall] = useState(null);
  const [exams, setExams] = useState([]);

  useFocusEffect(useCallback(() => {
    db.getFirstAsync('SELECT * FROM halls WHERE id = ?', [route.params.id]).then(setHall);
    db.getAllAsync(`${EXAM_SQL} WHERE e.hall_id = ? ORDER BY e.exam_date`, [route.params.id]).then(setExams);
  }, [db, route.params.id]));

  if (!hall) return null;
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <Hero emoji="🏛️" title={hall.name} subtitle={`${hall.building} • ${hall.floor}`} />
      <View style={[st.box, { marginTop: 14 }]}>
        <Row icon="👥" label="Capacity" value={`${hall.capacity} seats`} />
        <Row icon="🧭" label="How to get there" value={hall.directions} />
        <Row icon="🛠️" label="Facilities" value={hall.facilities} />
      </View>
      <SectionTitle>Exams in this hall</SectionTitle>
      {exams.length === 0 && <Empty text="No exams scheduled in this hall." />}
      {exams.map((e) => (
        <ExamCard key={e.id} exam={e} onPress={() => navigation.navigate('ExamDetail', { id: e.id })} />
      ))}
    </ScrollView>
  );
}
