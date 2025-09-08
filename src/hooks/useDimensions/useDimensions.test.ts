import { renderHook, act } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { useDimensions } from './useDimensions';

// Mock React Native Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
    addEventListener: jest.fn(),
  },
}));

const mockDimensions = Dimensions as jest.Mocked<typeof Dimensions>;

describe('useDimensions', () => {
  const mockWindowDimensions = {
    width: 375,
    height: 812,
    scale: 3,
    fontScale: 1,
  };

  const mockScreenDimensions = {
    width: 375,
    height: 812,
    scale: 3,
    fontScale: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockImplementation((type: 'window' | 'screen') => {
      if (type === 'window') return mockWindowDimensions;
      if (type === 'screen') return mockScreenDimensions;
      return mockWindowDimensions;
    });
  });

  describe('Initialization', () => {
    it('returns initial dimensions', () => {
      const { result } = renderHook(() => useDimensions());

      expect(result.current.window).toEqual(mockWindowDimensions);
      expect(result.current.screen).toEqual(mockScreenDimensions);
      expect(mockDimensions.get).toHaveBeenCalledWith('window');
      expect(mockDimensions.get).toHaveBeenCalledWith('screen');
    });

    it('sets up event listener on mount', () => {
      const mockRemove = jest.fn();
      mockDimensions.addEventListener.mockReturnValue({ remove: mockRemove });

      renderHook(() => useDimensions());

      expect(mockDimensions.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe('Dimension Changes', () => {
    it('updates dimensions when change event fires', () => {
      let changeHandler: ((dims: any) => void) | undefined;
      const mockRemove = jest.fn();
      
      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return { remove: mockRemove };
      });

      const { result } = renderHook(() => useDimensions());

      // Initial dimensions
      expect(result.current.window).toEqual(mockWindowDimensions);

      // Simulate dimension change
      const newDimensions = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      act(() => {
        changeHandler?.(newDimensions);
      });

      expect(result.current.window).toEqual(newDimensions.window);
      expect(result.current.screen).toEqual(newDimensions.screen);
    });

    it('handles multiple dimension changes', () => {
      let changeHandler: ((dims: any) => void) | undefined;
      const mockRemove = jest.fn();
      
      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return { remove: mockRemove };
      });

      const { result } = renderHook(() => useDimensions());

      // First change
      const firstChange = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      act(() => {
        changeHandler?.(firstChange);
      });

      expect(result.current.window).toEqual(firstChange.window);

      // Second change
      const secondChange = {
        window: { width: 768, height: 1024, scale: 2, fontScale: 1 },
        screen: { width: 768, height: 1024, scale: 2, fontScale: 1 },
      };

      act(() => {
        changeHandler?.(secondChange);
      });

      expect(result.current.window).toEqual(secondChange.window);
      expect(result.current.screen).toEqual(secondChange.screen);
    });
  });

  describe('Cleanup', () => {
    it('removes event listener on unmount', () => {
      const mockRemove = jest.fn();
      mockDimensions.addEventListener.mockReturnValue({ remove: mockRemove });

      const { unmount } = renderHook(() => useDimensions());

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });

    it('handles missing remove function gracefully', () => {
      mockDimensions.addEventListener.mockReturnValue(null);

      const { unmount } = renderHook(() => useDimensions());

      expect(() => unmount()).not.toThrow();
    });
  });
});
