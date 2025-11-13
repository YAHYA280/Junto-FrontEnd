import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { responsive, getDeviceSize, DeviceSize } from './responsive';

/**
 * Hook to get responsive values that update on dimension changes
 */
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => subscription?.remove();
  }, []);

  return {
    ...responsive,
    window: dimensions.window,
    screen: dimensions.screen,
    deviceSize: getDeviceSize(),
  };
};

/**
 * Hook to get screen orientation
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    Dimensions.get('window').height >= Dimensions.get('window').width
      ? 'portrait'
      : 'landscape'
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.height >= window.width ? 'portrait' : 'landscape');
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
};

/**
 * Hook to check if device matches a size category
 */
export const useDeviceSize = () => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>(getDeviceSize());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceSize(getDeviceSize());
    });

    return () => subscription?.remove();
  }, []);

  return {
    deviceSize,
    isSmall: deviceSize === DeviceSize.SMALL,
    isMedium: deviceSize === DeviceSize.MEDIUM,
    isLarge: deviceSize === DeviceSize.LARGE,
    isTablet: deviceSize === DeviceSize.TABLET,
  };
};

export default useResponsive;
