import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();

  const themes: Array<{ mode: 'light' | 'dark' | 'system'; label: string; icon: string }> = [
    { mode: 'light', label: 'Light', icon: '☀️' },
    { mode: 'dark', label: 'Dark', icon: '🌙' },
    { mode: 'system', label: 'System', icon: '⚙️' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
      <View style={styles.optionsContainer}>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.mode}
            style={[
              styles.option,
              {
                backgroundColor:
                  themeMode === theme.mode ? colors.primary + '33' : colors.backgroundSecondary,
                borderColor: themeMode === theme.mode ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setThemeMode(theme.mode)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{theme.icon}</Text>
            <Text
              style={[
                styles.label,
                {
                  color: themeMode === theme.mode ? colors.primary : colors.text,
                  fontWeight: themeMode === theme.mode ? '600' : '400',
                },
              ]}
            >
              {theme.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
});
