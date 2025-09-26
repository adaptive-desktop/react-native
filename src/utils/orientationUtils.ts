import { ScaledSize } from 'react-native';

/**
 * Debounce delay for orientation changes to prevent rapid layout updates
 * 400ms provides a good balance between responsiveness and stability
 */
export const ORIENTATION_CHANGE_DEBOUNCE = 400;

/**
 * Device type classification based on screen dimensions
 */
export type DeviceType = 'phone' | 'tablet' | 'desktop';

/**
 * Simple orientation state
 */
export interface OrientationState {
  orientation: 'portrait' | 'landscape';
  deviceType: DeviceType;
  dimensions: {
    window: ScaledSize;
    screen: ScaledSize;
  };
}

/**
 * Determine device type based on screen dimensions
 * Uses common breakpoints for device classification
 */
export const getDeviceType = (dimensions: ScaledSize): DeviceType => {
  const { width, height } = dimensions;
  const minDimension = Math.min(width, height);

  // Phone: smaller dimension < 600dp
  if (minDimension < 600) {
    return 'phone';
  }

  // Tablet: smaller dimension >= 600dp and < 900dp
  if (minDimension < 900) {
    return 'tablet';
  }

  // Desktop: larger screens
  return 'desktop';
};

/**
 * Get orientation from dimensions
 */
export const getOrientationFromDimensions = (
  dimensions: ScaledSize
): 'portrait' | 'landscape' => {
  return dimensions.width > dimensions.height ? 'landscape' : 'portrait';
};

/**
 * Create orientation state from dimensions
 */
export const createOrientationState = (
  windowDimensions: ScaledSize,
  screenDimensions: ScaledSize
): OrientationState => {
  const orientation = getOrientationFromDimensions(windowDimensions);
  const deviceType = getDeviceType(windowDimensions);

  return {
    orientation,
    deviceType,
    dimensions: {
      window: windowDimensions,
      screen: screenDimensions,
    },
  };
};

/**
 * Simple debounce function using React Native's timer
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay) as unknown as number;
  };
};

/**
 * Get recommended workspace layout based on device and orientation
 */
export const getRecommendedWorkspaceLayout = (
  deviceType: DeviceType,
  orientation: 'portrait' | 'landscape'
): 'stacked' | 'side-by-side' | 'flexible' => {
  if (deviceType === 'phone') {
    // Phones: portrait = stacked, landscape = side-by-side
    return orientation === 'portrait' ? 'stacked' : 'side-by-side';
  }

  if (deviceType === 'tablet') {
    // Tablets: more flexible, but prefer side-by-side in landscape
    return orientation === 'landscape' ? 'side-by-side' : 'flexible';
  }

  // Desktop: always flexible
  return 'flexible';
};
