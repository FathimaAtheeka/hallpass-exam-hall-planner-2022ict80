import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { st, Field, Chips, Button } from '../ui';
import { DEPARTMENTS, localISO, isValidDate, isValidTime } from '../utils';

export default function AddExamScreen({ navigation }) {
  const db = useSQLiteContext();
  const [halls, setHalls] = useState([]);
  const [invs, setInvs] = useState([]);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [date, setDate] = useState(localISO(1));
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('120');
  const [hall, setHall] = useState(null);
  const [inv, setInv] = useState(null);
  const [seat, setSeat] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    db.getAllAsync('SELECT * FROM halls ORDER BY name').then((h) => { setHalls(h); setHall(h[0]?.name); });
    db.getAllAsync('SELECT * FROM invigilators ORDER BY name').then((v) => { setInvs(v); setInv(v[0]?.name); });
  }, [db]);

  const save = async () => {
    const mins = parseInt(duration, 10);
    if (!code.trim() || !title.trim()) return Alert.alert('Missing info', 'Enter the subject code and title.');
    if (!isValidDate(date)) return Alert.alert('Invalid date', 'Use the format YYYY-MM-DD, e.g. 2026-12-05.');
    if (!isValidTime(time)) return Alert.alert('Invalid time', 'Use 24-hour format HH:MM, e.g. 09:30.');
    if (isNaN(mins) || mins <= 0) return Alert.alert('Invalid duration', 'Enter the duration in minutes.');
    const h = halls.find((x) => x.name === hall);
    const v = invs.find((x) => x.name === inv);
    await db.runAsync(
      `INSERT INTO exams (code, title, department, exam_date, start_time, duration_min, hall_id, invigilator_id, seat_range, instructions, is_saved)
       VALUES (?,?,?,?,?,?,?,?,?,?,1)`,
      [code.trim().toUpperCase(), title.trim(), dept, date, time, mins, h.id, v.id, seat.trim(), notes.trim()]);
    navigation.goBack();
  };

  const Label = ({ t }) => <Text style={{ marginTop: 14, fontWeight: '700' }}>{t}</Text>;

  return (
    <ScrollView style={st.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={st.box}>
        <Text style={st.h2}>New exam</Text>
        <Field label="Subject code" value={code} onChangeText={setCode} placeholder="e.g. CS3012" autoCapitalize="characters" />
        <Field label="Subject title" value={title} onChangeText={setTitle} placeholder="e.g. Mobile Application Development" />
        <Label t="Department" />
        <Chips options={DEPARTMENTS} selected={dept} onSelect={setDept} />
        <Field label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <Field label="Start time (HH:MM, 24-hour)" value={time} onChangeText={setTime} />
        <Field label="Duration (minutes)" value={duration} onChangeText={setDuration} keyboardType="numeric" />
        <Label t="Exam hall" />
        <Chips options={halls.map((h) => h.name)} selected={hall} onSelect={setHall} />
        <Label t="Invigilator" />
        <Chips options={invs.map((v) => v.name)} selected={inv} onSelect={setInv} />
        <Field label="Seat range (optional)" value={seat} onChangeText={setSeat} placeholder="e.g. A1 - A60" />
        <Field label="Instructions (optional)" value={notes} onChangeText={setNotes} placeholder="e.g. Bring your student ID" />
        <Button title="Save exam" onPress={save} />
      </View>
    </ScrollView>
  );
}
