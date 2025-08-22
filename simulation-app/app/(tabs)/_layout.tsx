import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { CustomTabBar } from '@/components/ui/CustomTabBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          headerTitle: () => (
            <Image
              source={require('@/assets/images/logo-caixa.png')}
              style={{ width: 120, height: 40 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel: 'Início',
        }}
      />
      <Tabs.Screen
        name="simulation"
        options={{
          title: 'Simulação',
          headerTitle: () => (
            <Image
              source={require('@/assets/images/logo-caixa.png')}
              style={{ width: 120, height: 40 }}
              resizeMode="contain"
            />
          ),
          tabBarLabel: 'Simulação',
        }}
      />
    </Tabs>
  );
}
