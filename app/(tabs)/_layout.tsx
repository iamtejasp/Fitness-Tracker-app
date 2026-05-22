import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

function TabBarIcon({
  name,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabLayout() {
  const { token, isBootstrapping } = useAuth();

  useEffect(() => {
    if (!isBootstrapping && !token) {
      router.replace('/login');
    }
  }, [isBootstrapping, token]);

  if (isBootstrapping || !token) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtle,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} /> }} />
      <Tabs.Screen name="workouts" options={{ title: 'Workouts', tabBarIcon: ({ color }) => <TabBarIcon name="barbell-outline" color={color} /> }} />
      <Tabs.Screen name="add" options={{ title: 'Add', tabBarIcon: ({ color }) => <TabBarIcon name="add-circle" color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <TabBarIcon name="analytics-outline" color={color} /> }} />
      <Tabs.Screen name="ai" options={{ title: 'Coach', tabBarIcon: ({ color }) => <TabBarIcon name="sparkles-outline" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} /> }} />
    </Tabs>
  );
}
