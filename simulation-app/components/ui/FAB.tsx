import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FABProps {
  onPress: () => void;
  icon: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'surface';
  size?: 'small' | 'large';
  extended?: boolean;
}

export function FAB({ 
  onPress, 
  icon, 
  label, 
  variant = 'primary',
  size = 'large',
  extended = true 
}: FABProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.secondary; // Orange
      case 'secondary':
        return colors.primary; // Blue
      case 'surface':
        return colors.surface;
      default:
        return colors.secondary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'surface':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const fabStyle = [
    styles.fab,
    {
      backgroundColor: getBackgroundColor(),
      height: size === 'large' ? 56 : 40,
      paddingHorizontal: extended ? 16 : 0,
      width: extended ? 'auto' : (size === 'large' ? 56 : 40),
    }
  ];

  return (
    <TouchableOpacity
      style={fabStyle}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <IconSymbol
          name={icon}
          size={size === 'large' ? 24 : 18}
          color={getTextColor()}
        />
        {extended && (
          <ThemedText style={[styles.label, { color: getTextColor() }]}>
            {label}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    shadowColor: '#000',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});