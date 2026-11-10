import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExamsScreen from '../screens/ExamsScreen';
import ExamDetailScreen from '../screens/ExamDetailScreen';
import HallsScreen from '../screens/HallsScreen';
import HallDetailScreen from '../screens/HallDetailScreen';
import InvigilatorsScreen from '../screens/InvigilatorsScreen';
import InvigilatorDetailScreen from '../screens/InvigilatorDetailScreen';
import MyExamsScreen from '../screens/MyExamsScreen';
import AddExamScreen from '../screens/AddExamScreen';
import AboutScreen from '../screens/AboutScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icon = (e) => ({ focused }) => <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>{e}</Text>;
const header = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{
      ...header,
      tabBarActiveTintColor: colors.primary,
      tabBarStyle: { height: 66, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, tabBarIcon: icon('🏠') }} />
      <Tab.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exam Timetable', tabBarLabel: 'Exams', tabBarIcon: icon('📝') }} />
      <Tab.Screen name="Halls" component={HallsScreen} options={{ title: 'Exam Halls', tabBarIcon: icon('🏛️') }} />
      <Tab.Screen name="MyExams" component={MyExamsScreen} options={{ title: 'My Exams', tabBarLabel: 'My Exams', tabBarIcon: icon('⭐') }} />
      <Tab.Screen name="About" component={AboutScreen} options={{ headerShown: false, tabBarLabel: 'About Us', tabBarIcon: icon('ℹ️') }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={header}>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="ExamDetail" component={ExamDetailScreen} options={{ title: 'Exam Details' }} />
        <Stack.Screen name="HallDetail" component={HallDetailScreen} options={{ title: 'Hall Details' }} />
        <Stack.Screen name="Invigilators" component={InvigilatorsScreen} options={{ title: 'Invigilators' }} />
        <Stack.Screen name="InvigilatorDetail" component={InvigilatorDetailScreen} options={{ title: 'Invigilator' }} />
        <Stack.Screen name="AddExam" component={AddExamScreen} options={{ title: 'Add Exam' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
