import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { Hero, Row, ExamCard, SectionTitle, Empty, st } from '../ui';
import { EXAM_SQL } from '../db/database';

export default function InvigilatorDetailScreen({ route, navigation }) {
  const db = useSQLiteContext();
  const [v, setV] = useState(null);
  const [exams, setExams] = useState([]);

  useFocusEffect(useCallback(() => {
    db.getFirstAsync('SELECT * FROM invigilators WHERE id = ?', [route.params.id]).then(setV);
    db.getAllAsync(`${EXAM_SQL} WHERE e.invigilator_id = ? ORDER BY e.exam_date`, [route.params.id]).then(setExams);
  }, [db, route.params.id]));

  if (!v) return null;
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <Hero emoji="🧑‍🏫" title={v.name} subtitle={`${v.department} Department`} />
      <View style={[st.box, { marginTop: 14 }]}>
        <Row icon="📞" label="Phone" value={v.phone} />
        <Row icon="✉️" label="Email" value={v.email} />
        <Row icon="🏢" label="Office" value={v.office} />
      </View>
      <SectionTitle>Assigned exams</SectionTitle>
      {exams.length === 0 && <Empty text="No exams assigned." />}
      {exams.map((e) => (
        <ExamCard key={e.id} exam={e} onPress={() => navigation.navigate('ExamDetail', { id: e.id })} />
      ))}
    </ScrollView>
  );
}
