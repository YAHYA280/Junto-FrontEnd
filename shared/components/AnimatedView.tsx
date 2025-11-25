import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

type AnimationType = 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';

interface AnimatedViewProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  animation = 'fade',
  delay = 0,
  duration = 600,
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const translateX = useSharedValue(50);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    const config = {
      duration,
      easing: Easing.out(Easing.cubic),
    };

    switch (animation) {
      case 'fade':
        opacity.value = withDelay(delay, withTiming(1, config));
        break;

      case 'slide':
      case 'slideUp':
        opacity.value = withDelay(delay, withTiming(1, config));
        translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
        break;

      case 'slideDown':
        opacity.value = withDelay(delay, withTiming(1, config));
        translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
        break;

      case 'slideLeft':
        opacity.value = withDelay(delay, withTiming(1, config));
        translateX.value = withDelay(delay, withSpring(0, { damping: 15 }));
        break;

      case 'slideRight':
        opacity.value = withDelay(delay, withTiming(1, config));
        translateX.value = withDelay(delay, withSpring(0, { damping: 15 }));
        break;

      case 'scale':
        opacity.value = withDelay(delay, withTiming(1, config));
        scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
        break;
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animation) {
      case 'fade':
        return { opacity: opacity.value };

      case 'slide':
      case 'slideUp':
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };

      case 'slideDown':
        return {
          opacity: opacity.value,
          transform: [{ translateY: -translateY.value }],
        };

      case 'slideLeft':
        return {
          opacity: opacity.value,
          transform: [{ translateX: -translateX.value }],
        };

      case 'slideRight':
        return {
          opacity: opacity.value,
          transform: [{ translateX: translateX.value }],
        };

      case 'scale':
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        };

      default:
        return { opacity: opacity.value };
    }
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};
