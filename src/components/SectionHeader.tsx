import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, onPress }) => {
  const { colors, dark } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        {title}
      </Text>
      {subtitle && onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SIZES.width - 32,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.greyscale900,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default SectionHeader;
