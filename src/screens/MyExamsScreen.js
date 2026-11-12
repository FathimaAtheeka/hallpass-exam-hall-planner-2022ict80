import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { st, ExamCard, Empty } from '../ui';
import { EXAM_SQL } from '../db/database';

export default function MyExamsScreen({ navigation }) {
  const db = useSQLiteContext();
  const [data, setData] = useState([]);

  useFocusEffect(useCallback(() => {
    db.getAllAsync(`${EXAM_SQL} WHERE e.is_saved = 1 ORDER BY e.exam_date, e.start_time`).then(setData);
  }, [db]));

  return (
    <View style={st.screen}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ paddingTop: 8 }}
        ListEmptyComponent={<Empty icon="⭐" text={'No saved exams yet.\nOpen an exam and tap "Add to My Exams".'} />}
        renderItem={({ item }) => (
          <ExamCard exam={item} onPress={() => navigation.navigate('ExamDetail', { id: item.id })} />
        )}
      />
    </View>
  );
}
