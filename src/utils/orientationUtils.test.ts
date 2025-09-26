import { ScaledSize } from 'react-native';
import {
  ORIENTATION_CHANGE_DEBOUNCE,
  getDeviceType,
  getOrientationFromDimensions,
  createOrientationState,
  debounce,
  getRecommendedWorkspaceLayout,
  type DeviceType,
} from './orientationUtils';

describe('orientationUtils', () => {
  describe('ORIENTATION_CHANGE_DEBOUNCE', () => {
    it('should be 400ms', () => {
      expect(ORIENTATION_CHANGE_DEBOUNCE).toBe(400);
    });
  });

  describe('getDeviceType', () => {
    it('should classify phone when min dimension < 600', () => {
      const phoneDimensions = {
        width: 375,
        height: 812,
        scale: 3,
        fontScale: 1,
      };
      expect(getDeviceType(phoneDimensions)).toBe('phone');
    });

    it('should classify phone when width is smaller dimension', () => {
      const phoneDimensions = {
        width: 375,
        height: 812,
        scale: 3,
        fontScale: 1,
      };
      expect(getDeviceType(phoneDimensions)).toBe('phone');
    });

    it('should classify phone when height is smaller dimension', () => {
      const phoneDimensions = {
        width: 812,
        height: 375,
        scale: 3,
        fontScale: 1,
      };
      expect(getDeviceType(phoneDimensions)).toBe('phone');
    });

    it('should classify tablet when min dimension >= 600 and < 900', () => {
      const tabletDimensions = {
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      };
      expect(getDeviceType(tabletDimensions)).toBe('tablet');
    });

    it('should classify tablet at boundary (599 should be phone)', () => {
      const phoneDimensions = {
        width: 599,
        height: 900,
        scale: 2,
        fontScale: 1,
      };
      expect(getDeviceType(phoneDimensions)).toBe('phone');
    });

    it('should classify tablet at boundary (600 should be tablet)', () => {
      const tabletDimensions = {
        width: 600,
        height: 900,
        scale: 2,
        fontScale: 1,
      };
      expect(getDeviceType(tabletDimensions)).toBe('tablet');
    });

    it('should classify tablet at upper boundary (899 should be tablet)', () => {
      const tabletDimensions = {
        width: 899,
        height: 1200,
        scale: 2,
        fontScale: 1,
      };
      expect(getDeviceType(tabletDimensions)).toBe('tablet');
    });

    it('should classify desktop when min dimension >= 900', () => {
      const desktopDimensions = {
        width: 1920,
        height: 1080,
        scale: 1,
        fontScale: 1,
      };
      expect(getDeviceType(desktopDimensions)).toBe('desktop');
    });

    it('should classify desktop at boundary (900 should be desktop)', () => {
      const desktopDimensions = {
        width: 900,
        height: 1200,
        scale: 1,
        fontScale: 1,
      };
      expect(getDeviceType(desktopDimensions)).toBe('desktop');
    });

    it('should handle square dimensions', () => {
      const squareDimensions = {
        width: 600,
        height: 600,
        scale: 1,
        fontScale: 1,
      };
      expect(getDeviceType(squareDimensions)).toBe('tablet');
    });

    it('should handle very large dimensions', () => {
      const largeDimensions = {
        width: 3840,
        height: 2160,
        scale: 2,
        fontScale: 1,
      };
      expect(getDeviceType(largeDimensions)).toBe('desktop');
    });
  });

  describe('getOrientationFromDimensions', () => {
    it('should return portrait when width <= height', () => {
      const portraitDimensions = {
        width: 375,
        height: 812,
        scale: 3,
        fontScale: 1,
      };
      expect(getOrientationFromDimensions(portraitDimensions)).toBe('portrait');
    });

    it('should return portrait when width === height (square)', () => {
      const squareDimensions = {
        width: 600,
        height: 600,
        scale: 1,
        fontScale: 1,
      };
      expect(getOrientationFromDimensions(squareDimensions)).toBe('portrait');
    });

    it('should return landscape when width > height', () => {
      const landscapeDimensions = {
        width: 812,
        height: 375,
        scale: 3,
        fontScale: 1,
      };
      expect(getOrientationFromDimensions(landscapeDimensions)).toBe(
        'landscape'
      );
    });
  });

  describe('createOrientationState', () => {
    const windowDimensions: ScaledSize = {
      width: 375,
      height: 812,
      scale: 3,
      fontScale: 1,
    };
    const screenDimensions: ScaledSize = {
      width: 375,
      height: 812,
      scale: 3,
      fontScale: 1,
    };

    it('should create orientation state with portrait phone', () => {
      const result = createOrientationState(windowDimensions, screenDimensions);

      expect(result).toEqual({
        orientation: 'portrait',
        deviceType: 'phone',
        dimensions: {
          window: windowDimensions,
          screen: screenDimensions,
        },
      });
    });

    it('should create orientation state with landscape tablet', () => {
      const landscapeWindow = {
        width: 1024,
        height: 768,
        scale: 2,
        fontScale: 1,
      };
      const landscapeScreen = {
        width: 1024,
        height: 768,
        scale: 2,
        fontScale: 1,
      };

      const result = createOrientationState(landscapeWindow, landscapeScreen);

      expect(result).toEqual({
        orientation: 'landscape',
        deviceType: 'tablet',
        dimensions: {
          window: landscapeWindow,
          screen: landscapeScreen,
        },
      });
    });

    it('should create orientation state with desktop', () => {
      const desktopWindow = {
        width: 1920,
        height: 1080,
        scale: 1,
        fontScale: 1,
      };
      const desktopScreen = {
        width: 1920,
        height: 1080,
        scale: 1,
        fontScale: 1,
      };

      const result = createOrientationState(desktopWindow, desktopScreen);

      expect(result).toEqual({
        orientation: 'landscape',
        deviceType: 'desktop',
        dimensions: {
          window: desktopWindow,
          screen: desktopScreen,
        },
      });
    });

    it('should handle different window and screen dimensions', () => {
      const differentWindow = {
        width: 414,
        height: 896,
        scale: 3,
        fontScale: 1,
      };
      const differentScreen = {
        width: 428,
        height: 926,
        scale: 3,
        fontScale: 1,
      };

      const result = createOrientationState(differentWindow, differentScreen);

      expect(result.dimensions.window).toBe(differentWindow);
      expect(result.dimensions.screen).toBe(differentScreen);
      expect(result.orientation).toBe('portrait');
      expect(result.deviceType).toBe('phone');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous call when called again within delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn(); // Cancel first call
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50); // Complete second call

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 123);

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('should handle zero delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn();

      jest.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple rapid calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with different function types', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 50);

      debouncedFn(5, 'hello');

      jest.advanceTimersByTime(50);

      expect(mockFn).toHaveBeenCalledWith(5, 'hello');
    });
  });

  describe('getRecommendedWorkspaceLayout', () => {
    describe('phone device type', () => {
      const deviceType: DeviceType = 'phone';

      it('should return stacked for portrait orientation', () => {
        expect(getRecommendedWorkspaceLayout(deviceType, 'portrait')).toBe(
          'stacked'
        );
      });

      it('should return side-by-side for landscape orientation', () => {
        expect(getRecommendedWorkspaceLayout(deviceType, 'landscape')).toBe(
          'side-by-side'
        );
      });
    });

    describe('tablet device type', () => {
      const deviceType: DeviceType = 'tablet';

      it('should return flexible for portrait orientation', () => {
        expect(getRecommendedWorkspaceLayout(deviceType, 'portrait')).toBe(
          'flexible'
        );
      });

      it('should return side-by-side for landscape orientation', () => {
        expect(getRecommendedWorkspaceLayout(deviceType, 'landscape')).toBe(
          'side-by-side'
        );
      });
    });

    describe('desktop device type', () => {
      const deviceType: DeviceType = 'desktop';

      it('should return flexible for portrait orientation', () => {
        expect(getRecommendedWorkspaceLayout(deviceType, 'portrait')).toBe(
          'flexible'
        );
      });

      it('should return flexible for landscape orientation', () => {
        expect(getRecommendedWorkspaceLayout(deviceType, 'landscape')).toBe(
          'flexible'
        );
      });
    });

    it('should handle all device type and orientation combinations', () => {
      const combinations = [
        {
          deviceType: 'phone' as DeviceType,
          orientation: 'portrait' as const,
          expected: 'stacked',
        },
        {
          deviceType: 'phone' as DeviceType,
          orientation: 'landscape' as const,
          expected: 'side-by-side',
        },
        {
          deviceType: 'tablet' as DeviceType,
          orientation: 'portrait' as const,
          expected: 'flexible',
        },
        {
          deviceType: 'tablet' as DeviceType,
          orientation: 'landscape' as const,
          expected: 'side-by-side',
        },
        {
          deviceType: 'desktop' as DeviceType,
          orientation: 'portrait' as const,
          expected: 'flexible',
        },
        {
          deviceType: 'desktop' as DeviceType,
          orientation: 'landscape' as const,
          expected: 'flexible',
        },
      ];

      combinations.forEach(({ deviceType, orientation, expected }) => {
        expect(getRecommendedWorkspaceLayout(deviceType, orientation)).toBe(
          expected
        );
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work together: dimensions -> device type -> orientation -> layout', () => {
      // Phone in portrait
      const phonePortrait = { width: 375, height: 812, scale: 3, fontScale: 1 };
      const deviceType = getDeviceType(phonePortrait);
      const orientation = getOrientationFromDimensions(phonePortrait);
      const layout = getRecommendedWorkspaceLayout(deviceType, orientation);

      expect(deviceType).toBe('phone');
      expect(orientation).toBe('portrait');
      expect(layout).toBe('stacked');
    });

    it('should work together: dimensions -> device type -> orientation -> layout (tablet landscape)', () => {
      // Tablet in landscape
      const tabletLandscape = {
        width: 1024,
        height: 768,
        scale: 2,
        fontScale: 1,
      };
      const deviceType = getDeviceType(tabletLandscape);
      const orientation = getOrientationFromDimensions(tabletLandscape);
      const layout = getRecommendedWorkspaceLayout(deviceType, orientation);

      expect(deviceType).toBe('tablet');
      expect(orientation).toBe('landscape');
      expect(layout).toBe('side-by-side');
    });

    it('should work together: createOrientationState integration', () => {
      const windowDims = { width: 1920, height: 1080, scale: 1, fontScale: 1 };
      const screenDims = { width: 1920, height: 1080, scale: 1, fontScale: 1 };

      const state = createOrientationState(windowDims, screenDims);

      expect(state.deviceType).toBe('desktop');
      expect(state.orientation).toBe('landscape');

      const layout = getRecommendedWorkspaceLayout(
        state.deviceType,
        state.orientation
      );
      expect(layout).toBe('flexible');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero dimensions', () => {
      const zeroDims = { width: 0, height: 0, scale: 1, fontScale: 1 };

      expect(getDeviceType(zeroDims)).toBe('phone');
      expect(getOrientationFromDimensions(zeroDims)).toBe('portrait');
    });

    it('should handle very small dimensions', () => {
      const tinyDims = { width: 1, height: 1, scale: 1, fontScale: 1 };

      expect(getDeviceType(tinyDims)).toBe('phone');
      expect(getOrientationFromDimensions(tinyDims)).toBe('portrait');
    });

    it('should handle very large dimensions', () => {
      const hugeDims = { width: 10000, height: 10000, scale: 1, fontScale: 1 };

      expect(getDeviceType(hugeDims)).toBe('desktop');
      expect(getOrientationFromDimensions(hugeDims)).toBe('portrait');
    });

    it('should handle fractional dimensions', () => {
      const fractionalDims = {
        width: 599.5,
        height: 900.8,
        scale: 2.5,
        fontScale: 1.2,
      };

      expect(getDeviceType(fractionalDims)).toBe('phone'); // 599.5 < 600
      expect(getOrientationFromDimensions(fractionalDims)).toBe('portrait');
    });

    it('should handle edge case at tablet lower boundary', () => {
      const edgeTablet = { width: 600, height: 600, scale: 1, fontScale: 1 };

      expect(getDeviceType(edgeTablet)).toBe('tablet');
    });

    it('should handle edge case at tablet upper boundary', () => {
      const edgeDesktop = { width: 900, height: 900, scale: 1, fontScale: 1 };

      expect(getDeviceType(edgeDesktop)).toBe('desktop');
    });
  });
});
