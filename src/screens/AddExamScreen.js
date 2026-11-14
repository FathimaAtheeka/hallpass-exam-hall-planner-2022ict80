import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";

import { useSQLiteContext } from "expo-sqlite";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

import { st, Field, Button } from "../ui";
import { DEPARTMENTS, localISO, isValidDate, isValidTime, pad } from "../utils";

export default function AddExamScreen({ navigation }) {
  const db = useSQLiteContext();

  const [halls, setHalls] = useState([]);
  const [invs, setInvs] = useState([]);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState(DEPARTMENTS[0]);

  const [date, setDate] = useState(localISO(1));
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("120");

  const [hallId, setHallId] = useState("");
  const [invId, setInvId] = useState("");

  const [seat, setSeat] = useState("");
  const [notes, setNotes] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Load halls and invigilators from database
  useEffect(() => {
    db.getAllAsync("SELECT * FROM halls ORDER BY name").then((h) => {
      setHalls(h);
      setHallId(h.length > 0 ? String(h[0].id) : "");
    });

    db.getAllAsync("SELECT * FROM invigilators ORDER BY name").then((v) => {
      setInvs(v);
      setInvId(v.length > 0 ? String(v[0].id) : "");
    });
  }, [db]);

  // Convert selected date into YYYY-MM-DD
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    const formattedDate = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;

    setDate(formattedDate);
  };

  // Convert selected time into HH:MM
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);

    if (event.type === "dismissed" || !selectedTime) {
      return;
    }

    setTime(
      `${pad(selectedTime.getHours())}:${pad(selectedTime.getMinutes())}`,
    );
  };

  // Save exam into SQLite database
  const save = async () => {
    const mins = Number(duration);

    if (!code.trim() || !title.trim()) {
      return Alert.alert("Missing info", "Enter the subject code and title.");
    }

    if (!isValidDate(date)) {
      return Alert.alert("Invalid date", "Select a valid exam date.");
    }

    if (!isValidTime(time)) {
      return Alert.alert("Invalid time", "Select a valid start time.");
    }

    if (!Number.isInteger(mins) || mins <= 0) {
      return Alert.alert(
        "Invalid duration",
        "Enter a valid duration in minutes.",
      );
    }

    const h = halls.find((x) => x.id === Number(hallId));
    const v = invs.find((x) => x.id === Number(invId));

    if (!h || !v) {
      return Alert.alert(
        "Missing selection",
        "Select an exam hall and invigilator.",
      );
    }

    await db.runAsync(
      `INSERT INTO exams
       (code, title, department, exam_date, start_time, duration_min,
        hall_id, invigilator_id, seat_range, instructions, is_saved)
       VALUES (?,?,?,?,?,?,?,?,?,?,1)`,
      [
        code.trim().toUpperCase(),
        title.trim(),
        dept,
        date,
        time,
        mins,
        h.id,
        v.id,
        seat.trim(),
        notes.trim(),
      ],
    );

    Alert.alert("Success", "Exam added successfully.", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const Label = ({ children }) => (
    <Text style={{ marginTop: 14, fontWeight: "700", color: "#333" }}>
      {children}
    </Text>
  );

  const SelectBox = ({ children }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        marginTop: 6,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );

  const dateObject = new Date(`${date}T00:00:00`);

  const timeObject = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  timeObject.setHours(hours, minutes, 0, 0);

  return (
    <ScrollView
      style={st.screen}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={st.box}>
        <Text style={st.h2}>New exam</Text>

        <Field
          label="Subject code"
          value={code}
          onChangeText={setCode}
          placeholder="e.g. CS3012"
          autoCapitalize="characters"
        />

        <Field
          label="Subject title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Mobile Application Development"
        />

        {/* Department dropdown */}
        <Label>Department</Label>

        <SelectBox>
          <Picker selectedValue={dept} onValueChange={setDept}>
            {DEPARTMENTS.map((department) => (
              <Picker.Item
                key={department}
                label={department}
                value={department}
              />
            ))}
          </Picker>
        </SelectBox>

        {/* Date picker */}
        <Label>Exam date</Label>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            padding: 14,
            marginTop: 6,
          }}
        >
          <Text>{date}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateObject}
            mode="date"
            display={Platform.OS === "ios" ? "compact" : "default"}
            onChange={handleDateChange}
          />
        )}

        {/* Time picker */}
        <Label>Start time</Label>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            padding: 14,
            marginTop: 6,
          }}
        >
          <Text>{time}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={timeObject}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "compact" : "default"}
            onChange={handleTimeChange}
          />
        )}

        {/* Numeric input */}
        <Field
          label="Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="e.g. 120"
        />

        {/* Exam hall dropdown */}
        <Label>Exam hall</Label>

        <SelectBox>
          <Picker selectedValue={hallId} onValueChange={setHallId}>
            {halls.map((h) => (
              <Picker.Item key={h.id} label={h.name} value={String(h.id)} />
            ))}
          </Picker>
        </SelectBox>

        {/* Invigilator dropdown */}
        <Label>Invigilator</Label>

        <SelectBox>
          <Picker selectedValue={invId} onValueChange={setInvId}>
            {invs.map((v) => (
              <Picker.Item key={v.id} label={v.name} value={String(v.id)} />
            ))}
          </Picker>
        </SelectBox>

        <Field
          label="Seat range (optional)"
          value={seat}
          onChangeText={setSeat}
          placeholder="e.g. A1 - A60"
        />

        <Field
          label="Instructions (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Bring your student ID"
        />

        <Button title="Save exam" onPress={save} />
      </View>
    </ScrollView>
  );
}
