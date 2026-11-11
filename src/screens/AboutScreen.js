import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Hero, SectionTitle, st } from '../ui';
import { colors } from '../theme';

const FEATURES = [
  ['📝', 'Exam Timetable', 'Search and filter every paper by date, subject or department.'],
  ['⏳', 'Live Countdown', 'See exactly how many days are left for each exam.'],
  ['🏛️', 'Hall Finder', 'Hall, building, floor and walking directions.'],
  ['💺', 'Seat Range', 'Know your seat block before you arrive.'],
  ['🧑‍🏫', 'Invigilators', 'Who is supervising, and how to contact them.'],
  ['⭐', 'My Exams', 'Save the papers that matter to you.'],
];

const STEPS = [
  'Open the Exams tab and search or filter your subject.',
  'Tap an exam to see the hall, time, seat range and countdown.',
  'Tap "Add to My Exams" to keep it in your personal list.',
  'Use the hall details to find the building and floor.',
];

export default function AboutScreen() {
  const Card = ({ icon, title, text }) => (
    <View style={[st.box, { width: '47%', marginHorizontal: 0, marginTop: 0, padding: 14 }]}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text style={{ fontWeight: '800', color: colors.text, marginTop: 6 }}>{title}</Text>
      <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12, lineHeight: 17 }}>{text}</Text>
    </View>
  );

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Hero top emoji="📍" title="About Us" subtitle="HallPass helps university students never get lost on exam day." />

      <View style={st.box}>
        <Text style={st.h2}>Our mission</Text>
        <Text style={st.p}>
          Exam days are stressful enough. Students often struggle to find the right hall, the right building or their seat
          block, and miss the countdown to an important paper. HallPass keeps exam dates, halls, seat ranges and
          invigilator details in one simple offline app, so you can walk in calm and on time.
        </Text>
      </View>

      <SectionTitle>What you can do</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 14, marginTop: 10, rowGap: 12 }}>
        {FEATURES.map((f) => <Card key={f[1]} icon={f[0]} title={f[1]} text={f[2]} />)}
      </View>

      <SectionTitle>How to use</SectionTitle>
      <View style={st.box}>
        {STEPS.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>{i + 1}</Text>
            </View>
            <Text style={{ flex: 1, marginLeft: 12, color: colors.text, lineHeight: 20 }}>{s}</Text>
          </View>
        ))}
      </View>

      <SectionTitle>Developer</SectionTitle>
      <View style={[st.box, { alignItems: 'center' }]}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 34 }}>👨‍🎓</Text>
        </View>
  
        <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 10, color: colors.text }}>Your Name</Text>
        <Text style={{ color: colors.muted }}>Index No: 00000000</Text>
        <Text style={{ color: colors.muted }}>University Name • Department</Text>
        <Text style={{ color: colors.primary, marginTop: 8, fontWeight: '700', textAlign: 'center' }}>
          ICA 03 – Individual React Native Project
        </Text>
      </View>

      <View style={[st.box, { backgroundColor: colors.primaryDark }]}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>🔒 100% offline</Text>
        <Text style={{ color: '#D9D5F7', marginTop: 6, lineHeight: 20 }}>
          All data is stored on your phone in a local SQLite database. No internet connection or online service is used.
        </Text>
        <Text style={{ color: colors.accent, marginTop: 10, fontWeight: '700' }}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
