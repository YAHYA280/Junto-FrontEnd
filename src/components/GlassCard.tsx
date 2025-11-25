import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, glassStyles, blurIntensity } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'light' | 'medium' | 'dark' | 'card';
  intensity?: keyof typeof blurIntensity;
  blurEnabled?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'card',
  intensity = 'medium',
  blurEnabled = true,
}) => {
  const glassStyle = glassStyles[variant];

  if (blurEnabled) {
    return (
      <BlurView
        intensity={blurIntensity[intensity]}
        tint="dark"
        style={[glassStyle, style]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[glassStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});
