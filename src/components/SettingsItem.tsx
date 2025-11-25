import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { SIZES, COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItemProps {
  icon: string;
  name: string;
  onPress: () => void;
  hasArrowRight?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, name, onPress, hasArrowRight = true }) => {
  const { dark } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.leftContainer}>
        <Ionicons
          name={icon as any}
          size={24}
          color={dark ? COLORS.white : COLORS.greyscale900}
          style={styles.icon}
        />
        <Text
          style={[
            styles.name,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        >
          {name}
        </Text>
      </View>
      {hasArrowRight && (
        <Ionicons
          name="chevron-forward"
          size={24}
          color={dark ? COLORS.white : COLORS.greyscale900}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.greyscale900,
  },
});

export default SettingsItem;
