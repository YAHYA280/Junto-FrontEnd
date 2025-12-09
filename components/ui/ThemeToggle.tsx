import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();

  const themes: Array<{
    mode: 'light' | 'dark' | 'system';
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    { mode: 'light', label: 'Light', icon: 'sunny' },
    { mode: 'dark', label: 'Dark', icon: 'moon' },
    { mode: 'system', label: 'System', icon: 'settings' },
  ];

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? colors.surface : '#FFFFFF',
        borderWidth: 1,
        borderColor: isDark ? colors.border : '#E5E7EB',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      }
    ]}>
      <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
      <View style={styles.optionsContainer}>
        {themes.map((theme) => {
          const isActive = themeMode === theme.mode;

          return (
            <TouchableOpacity
              key={theme.mode}
              style={[
                styles.option,
                {
                  backgroundColor: isActive
                    ? isDark ? colors.primary + '22' : '#ECFDF5'
                    : isDark ? colors.backgroundSecondary : '#F9FAFB',
                  borderColor: isActive ? colors.primary : isDark ? colors.border : '#E5E7EB',
                  shadowColor: isActive ? colors.primary : '#000000',
                  shadowOffset: { width: 0, height: isActive ? 2 : 1 },
                  shadowOpacity: isActive ? 0.2 : (isDark ? 0.2 : 0.06),
                  shadowRadius: isActive ? 4 : 2,
                  elevation: isActive ? 3 : 1,
                },
              ]}
              onPress={() => setThemeMode(theme.mode)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={theme.icon}
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? colors.primary : colors.text,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {theme.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
});
