import React, { useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlareHoverProps {
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareSize?: number;
  transitionDuration?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

export const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareSize = 300,
  transitionDuration = 800,
  style,
  disabled = false,
}) => {
  const glareAnim = useRef(new Animated.Value(0)).current;
  const glarePosition = useRef(new Animated.ValueXY({ x: -200, y: -200 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        animateGlareIn();
      },
      onPanResponderMove: (_, gestureState) => {
        glarePosition.setValue({
          x: gestureState.moveX,
          y: gestureState.moveY,
        });
      },
      onPanResponderRelease: () => {
        animateGlareOut();
      },
      onPanResponderTerminate: () => {
        animateGlareOut();
      },
    })
  ).current;

  const animateGlareIn = () => {
    Animated.parallel([
      Animated.timing(glareAnim, {
        toValue: 1,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
      Animated.timing(glarePosition.x, {
        toValue: 0,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
      Animated.timing(glarePosition.y, {
        toValue: 0,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateGlareOut = () => {
    Animated.parallel([
      Animated.timing(glareAnim, {
        toValue: 0,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
      Animated.timing(glarePosition.x, {
        toValue: -200,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
      Animated.timing(glarePosition.y, {
        toValue: -200,
        duration: transitionDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const glareOpacityValue = glareAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, glareOpacity],
  });

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      {children}
      {!disabled && (
        <Animated.View
          style={[
            styles.glareOverlay,
            {
              opacity: glareOpacityValue,
              transform: [
                { translateX: glarePosition.x },
                { translateY: glarePosition.y },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[
              'transparent',
              `${glareColor}40`,
              `${glareColor}80`,
              `${glareColor}40`,
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { width: glareSize, height: glareSize }]}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  glareOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
  },
});
