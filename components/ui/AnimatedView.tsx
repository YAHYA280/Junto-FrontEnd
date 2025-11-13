import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface AnimatedViewProps extends ViewProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';
  delay?: number;
  duration?: number;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  animation = 'fade',
  delay = 0,
  duration = 500,
  style,
  ...props
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(animation === 'slideDown' ? -30 : 30);
  const translateX = useSharedValue(30);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    const easeOut = Easing.bezier(0.25, 0.1, 0.25, 1);

    if (animation === 'fade') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: easeOut,
        })
      );
    } else if (animation === 'slide') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: duration * 0.6,
          easing: easeOut,
        })
      );
      translateX.value = withDelay(
        delay,
        withTiming(0, {
          duration,
          easing: easeOut,
        })
      );
    } else if (animation === 'scale') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: duration * 0.6,
          easing: easeOut,
        })
      );
      scale.value = withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: easeOut,
        })
      );
    } else if (animation === 'slideUp' || animation === 'slideDown') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: duration * 0.6,
          easing: easeOut,
        })
      );
      translateY.value = withDelay(
        delay,
        withTiming(0, {
          duration,
          easing: easeOut,
        })
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animation) {
      case 'fade':
        return { opacity: opacity.value };
      case 'slide':
        return {
          opacity: opacity.value,
          transform: [{ translateX: translateX.value }],
        };
      case 'scale':
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        };
      case 'slideUp':
      case 'slideDown':
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
      default:
        return { opacity: opacity.value };
    }
  });

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
};

export default AnimatedView;
