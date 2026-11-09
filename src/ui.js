import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadow } from './theme';
import { daysLeft, countdownLabel, countdownColor, dayNum, monthShort, formatTime } from './utils';

export function Hero({ title, subtitle, emoji, top, children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[st.hero, { paddingTop: (top ? insets.top : 0) + 20 }]}>
      <View style={st.circle1} />
      <View style={st.circle2} />
      {emoji ? <Text style={st.heroEmoji}>{emoji}</Text> : null}
      <Text style={st.heroTitle}>{title}</Text>
      {subtitle ? <Text style={st.heroSub}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function SearchBar({ value, onChangeText, placeholder }) {
  return (
    <View style={st.searchWrap}>
      <Text style={{ fontSize: 16 }}>🔍</Text>
      <TextInput style={st.searchInput} value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={colors.muted} />
    </View>
  );
}

export function Chips({ options, selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={st.chipRow}>
      {options.map((o) => (
        <TouchableOpacity key={o} onPress={() => onSelect(o)} style={[st.chip, selected === o && st.chipOn]}>
          <Text style={[st.chipText, selected === o && st.chipTextOn]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export function Badge({ label, color }) {
  return (
    <View style={[st.badge, { backgroundColor: color }]}>
      <Text style={st.badgeText}>{label}</Text>
    </View>
  );
}

export function ExamCard({ exam, onPress }) {
  const d = daysLeft(exam.exam_date);
  const c = countdownColor(d);
  return (
    <TouchableOpacity activeOpacity={0.85} style={[st.card, { borderLeftColor: c }]} onPress={onPress}>
      <View style={st.dateBox}>
        <Text style={st.dateDay}>{dayNum(exam.exam_date)}</Text>
        <Text style={st.dateMon}>{monthShort(exam.exam_date)}</Text>
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={st.cardTitle} numberOfLines={1}>{exam.title}</Text>
        <Text style={st.cardSub}>{exam.code} • {exam.department}</Text>
        <Text style={st.cardMeta}>🕘 {formatTime(exam.start_time)}   📍 {exam.hall_name}</Text>
      </View>
      <Badge label={countdownLabel(d)} color={c} />
    </TouchableOpacity>
  );
}

export function ListCard({ icon, title, subtitle, meta, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={[st.card, { borderLeftColor: colors.primary }]} onPress={onPress}>
      <View style={st.iconBox}><Text style={{ fontSize: 24 }}>{icon}</Text></View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={st.cardTitle}>{title}</Text>
        <Text style={st.cardSub}>{subtitle}</Text>
        {meta ? <Text style={st.cardMeta}>{meta}</Text> : null}
      </View>
      <Text style={{ color: colors.muted, fontSize: 22 }}>›</Text>
    </TouchableOpacity>
  );
}

export function SectionTitle({ children, action, onAction }) {
  return (
    <View style={st.sectionRow}>
      <Text style={st.sectionTitle}>{children}</Text>
      {action ? <TouchableOpacity onPress={onAction}><Text style={st.sectionAction}>{action}</Text></TouchableOpacity> : null}
    </View>
  );
}

export function Row({ icon, label, value }) {
  return (
    <View style={st.row}>
      <Text style={st.rowIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={st.rowLabel}>{label}</Text>
        <Text style={st.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export function Button({ title, onPress, color = colors.primary, outline }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}
      style={[st.btn, outline ? { backgroundColor: '#fff', borderWidth: 1.5, borderColor: color } : { backgroundColor: color }]}>
      <Text style={[st.btnText, outline && { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, ...props }) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={st.fieldLabel}>{label}</Text>
      <TextInput style={st.input} placeholderTextColor={colors.muted} {...props} />
    </View>
  );
}

export function Fab({ onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={st.fab} onPress={onPress}>
      <Text style={{ color: '#fff', fontSize: 30, marginTop: -2 }}>＋</Text>
    </TouchableOpacity>
  );
}

export const Empty = ({ icon = '📭', text }) => (
  <View style={{ alignItems: 'center', marginTop: 50, paddingHorizontal: 30 }}>
    <Text style={{ fontSize: 48 }}>{icon}</Text>
    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>{text}</Text>
  </View>
);

export const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingBottom: 28, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)', top: -50, right: -40 },
  circle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,176,32,0.18)', bottom: -40, left: -30 },
  heroEmoji: { fontSize: 44, marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 27, fontWeight: '800' },
  heroSub: { color: '#D9D5F7', marginTop: 6, lineHeight: 20 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, marginHorizontal: 14, marginTop: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, paddingVertical: 12, paddingLeft: 8, color: colors.text },
  chipRow: { paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '500' },
  chipTextOn: { color: '#fff', fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: colors.card, marginHorizontal: 14, marginVertical: 6, padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5, ...shadow },
  dateBox: { backgroundColor: '#EEEBFF', width: 54, height: 58, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontSize: 20, fontWeight: '800', color: colors.primary },
  dateMon: { fontSize: 11, fontWeight: '700', color: colors.muted },
  iconBox: { backgroundColor: '#EEEBFF', width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardSub: { color: colors.muted, marginTop: 2, fontSize: 13 },
  cardMeta: { color: colors.primary, marginTop: 5, fontSize: 12, fontWeight: '600' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 18, marginTop: 18, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  sectionAction: { color: colors.primary, fontWeight: '700' },
  box: { backgroundColor: colors.card, marginHorizontal: 14, marginTop: 14, padding: 16, borderRadius: 18, ...shadow },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { fontSize: 22, width: 38 },
  rowLabel: { color: colors.muted, fontSize: 12 },
  rowValue: { color: colors.text, fontWeight: '600', fontSize: 15, marginTop: 1 },
  btn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  fieldLabel: { fontWeight: '700', color: colors.text },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginTop: 6, color: colors.text },
  fab: { position: 'absolute', right: 18, bottom: 18, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', ...shadow },
  h2: { fontSize: 18, fontWeight: '800', color: colors.text },
  p: { color: colors.text, lineHeight: 22, marginTop: 8 },
});
