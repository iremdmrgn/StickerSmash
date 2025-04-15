import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#ffd33d',
    headerStyle: {
      backgroundColor: '#25292e',
    },
    headerShadowVisible: false,
    headerTintColor: '#fff',
    headerTitle: 'Sticker Smash', // ← sabit başlık burada
    tabBarStyle: {
      backgroundColor: '#25292e',
    },
  }}
>

  
<Tabs.Screen
  name="index"
  options={{
    tabBarLabel: 'Home', // ← alt çubukta gözüken isim
    tabBarIcon: ({ color, focused }) => (
      <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
    ),
  }}
/>

<Tabs.Screen
  name="about"
  options={{
    tabBarLabel: 'About',
    tabBarIcon: ({ color, focused }) => (
      <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
    ),
  }}
/>

    </Tabs>
  );
}
