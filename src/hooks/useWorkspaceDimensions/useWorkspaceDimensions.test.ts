import { renderHook, act } from '@testing-library/react-native';
import { Dimensions, EmitterSubscription, ScaledSize } from 'react-native';
import { WorkspaceInterface } from '@adaptive-desktop/adaptive-workspace';
import { useWorkspaceDimensions } from './useWorkspaceDimensions';
import { ORIENTATION_CHANGE_DEBOUNCE } from '../../utils/orientationUtils';

// Mock React Native Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
    addEventListener: jest.fn(),
  },
}));

// Mock orientationUtils
jest.mock('../../utils/orientationUtils', () => ({
  ...jest.requireActual('../../utils/orientationUtils'),
  ORIENTATION_CHANGE_DEBOUNCE: 400,
  createOrientationState: jest.fn(),
}));

const mockDimensions = Dimensions as jest.Mocked<typeof Dimensions>;
const mockCreateOrientationState = jest.requireMock(
  '../../utils/orientationUtils'
).createOrientationState;

// Mock workspace
const createMockWorkspace = (): jest.Mocked<WorkspaceInterface> => ({
  id: 'test-workspace',
  name: 'Test Workspace',
  setScreenBounds: jest.fn(),
  screenBounds: { x: 0, y: 0, width: 375, height: 812 },
  viewports: new Map(),
  createViewport: jest.fn(),
  removeViewport: jest.fn(),
  splitViewport: jest.fn(),
  createAdjacentViewport: jest.fn(),
  swapViewports: jest.fn(),
  hasViewport: jest.fn(),
  minimizeViewport: jest.fn(),
  maximizeViewport: jest.fn(),
  restoreViewport: jest.fn(),
});

// Create a simple mock subscription
const createMockSubscription = (remove: jest.Mock): EmitterSubscription =>
  ({
    remove,
    emitter: {} as unknown as EmitterSubscription['emitter'],
    listener: jest.fn() as unknown as EmitterSubscription['listener'],
    context: {},
    eventType: 'change',
    key: 1,
    subscriber: {} as unknown as EmitterSubscription['subscriber'],
  }) as unknown as EmitterSubscription;

// Type for dimension change handler
type DimensionChangeHandler = (dims: {
  window: ScaledSize;
  screen: ScaledSize;
}) => void;

describe('useWorkspaceDimensions', () => {
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

  const mockOrientationState = {
    orientation: 'portrait' as const,
    deviceType: 'phone' as const,
    dimensions: {
      window: mockWindowDimensions,
      screen: mockScreenDimensions,
    },
  };

  let mockWorkspace: jest.Mocked<WorkspaceInterface>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockWorkspace = createMockWorkspace();

    mockDimensions.get.mockImplementation((type: 'window' | 'screen') => {
      if (type === 'window') return mockWindowDimensions;
      if (type === 'screen') return mockScreenDimensions;
      return mockWindowDimensions;
    });

    mockCreateOrientationState.mockReturnValue(mockOrientationState);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('returns initial state with default options', () => {
      const { result } = renderHook(() => useWorkspaceDimensions());

      expect(result.current.orientationState).toEqual(mockOrientationState);
      expect(result.current.window).toEqual(mockWindowDimensions);
      expect(result.current.screen).toEqual(mockScreenDimensions);
      expect(result.current.isChanging).toBe(false);
      expect(typeof result.current.updateWorkspaceScreenBounds).toBe(
        'function'
      );
    });

    it('initializes with custom options', () => {
      const options = {
        workspace: mockWorkspace,
        debounceDelay: 500,
        autoUpdateWorkspace: false,
      };

      const { result } = renderHook(() => useWorkspaceDimensions(options));

      expect(result.current.orientationState).toEqual(mockOrientationState);
      expect(mockCreateOrientationState).toHaveBeenCalledWith(
        mockWindowDimensions,
        mockScreenDimensions
      );
    });

    it('sets up event listener on mount', () => {
      const mockRemove = jest.fn();
      mockDimensions.addEventListener.mockReturnValue(
        createMockSubscription(mockRemove)
      );

      renderHook(() => useWorkspaceDimensions());

      expect(mockDimensions.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('initializes workspace screenBounds when autoUpdateWorkspace is true', () => {
      renderHook(() =>
        useWorkspaceDimensions({
          workspace: mockWorkspace,
          autoUpdateWorkspace: true,
        })
      );

      expect(mockWorkspace.setScreenBounds).toHaveBeenCalledWith({
        x: 0,
        y: 0,
        width: mockWindowDimensions.width,
        height: mockWindowDimensions.height,
      });
    });

    it('does not initialize workspace screenBounds when autoUpdateWorkspace is false', () => {
      renderHook(() =>
        useWorkspaceDimensions({
          workspace: mockWorkspace,
          autoUpdateWorkspace: false,
        })
      );

      expect(mockWorkspace.setScreenBounds).not.toHaveBeenCalled();
    });

    it('does not initialize workspace screenBounds when no workspace provided', () => {
      renderHook(() =>
        useWorkspaceDimensions({
          autoUpdateWorkspace: true,
        })
      );

      // Should not throw or cause issues
      expect(mockWorkspace.setScreenBounds).not.toHaveBeenCalled();
    });
  });

  describe('Dimension Changes', () => {
    it('updates dimensions immediately when change event fires', () => {
      let changeHandler: DimensionChangeHandler | undefined;
      const mockRemove = jest.fn();

      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return createMockSubscription(mockRemove);
      });

      const { result } = renderHook(() => useWorkspaceDimensions());

      const newDimensions = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      act(() => {
        changeHandler?.(newDimensions);
      });

      // Dimensions should update immediately
      expect(result.current.window).toEqual(newDimensions.window);
      expect(result.current.screen).toEqual(newDimensions.screen);
      expect(result.current.isChanging).toBe(true);
    });

    it('debounces orientation state updates', () => {
      let changeHandler: DimensionChangeHandler | undefined;
      const mockRemove = jest.fn();

      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return createMockSubscription(mockRemove);
      });

      const { result } = renderHook(() => useWorkspaceDimensions());

      const newDimensions = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      const newOrientationState = {
        orientation: 'landscape' as const,
        deviceType: 'phone' as const,
        dimensions: newDimensions,
      };

      mockCreateOrientationState.mockReturnValue(newOrientationState);

      act(() => {
        changeHandler?.(newDimensions);
      });

      // Should be changing but orientation not updated yet
      expect(result.current.isChanging).toBe(true);
      expect(result.current.orientationState).toEqual(mockOrientationState);

      // Fast-forward debounce timer
      act(() => {
        jest.advanceTimersByTime(ORIENTATION_CHANGE_DEBOUNCE);
      });

      // Now orientation should be updated
      expect(result.current.isChanging).toBe(false);
      expect(result.current.orientationState).toEqual(newOrientationState);
      expect(mockCreateOrientationState).toHaveBeenCalledWith(
        newDimensions.window,
        newDimensions.screen
      );
    });

    it('does not auto-update workspace when autoUpdateWorkspace is false', () => {
      let changeHandler: DimensionChangeHandler | undefined;
      const mockRemove = jest.fn();

      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return createMockSubscription(mockRemove);
      });

      renderHook(() =>
        useWorkspaceDimensions({
          workspace: mockWorkspace,
          autoUpdateWorkspace: false,
        })
      );

      const newDimensions = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      act(() => {
        changeHandler?.(newDimensions);
        jest.advanceTimersByTime(ORIENTATION_CHANGE_DEBOUNCE);
      });

      expect(mockWorkspace.setScreenBounds).not.toHaveBeenCalled();
    });

    it('uses custom debounce delay', () => {
      let changeHandler: DimensionChangeHandler | undefined;
      const mockRemove = jest.fn();
      const customDelay = 1000;

      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return createMockSubscription(mockRemove);
      });

      const { result } = renderHook(() =>
        useWorkspaceDimensions({
          debounceDelay: customDelay,
        })
      );

      const newDimensions = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      act(() => {
        changeHandler?.(newDimensions);
      });

      expect(result.current.isChanging).toBe(true);

      // Advance by default delay - should still be changing
      act(() => {
        jest.advanceTimersByTime(ORIENTATION_CHANGE_DEBOUNCE);
      });

      expect(result.current.isChanging).toBe(true);

      // Advance by custom delay
      act(() => {
        jest.advanceTimersByTime(customDelay - ORIENTATION_CHANGE_DEBOUNCE);
      });

      expect(result.current.isChanging).toBe(false);
    });

    it('cancels previous debounce timer on rapid changes', () => {
      let changeHandler: DimensionChangeHandler | undefined;
      const mockRemove = jest.fn();

      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return createMockSubscription(mockRemove);
      });

      const { result } = renderHook(() => useWorkspaceDimensions());

      const firstDimensions = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      const secondDimensions = {
        window: { width: 768, height: 1024, scale: 2, fontScale: 1 },
        screen: { width: 768, height: 1024, scale: 2, fontScale: 1 },
      };

      // First change
      act(() => {
        changeHandler?.(firstDimensions);
      });

      expect(result.current.isChanging).toBe(true);

      // Second change before first debounce completes
      act(() => {
        jest.advanceTimersByTime(200); // Partial advance
        changeHandler?.(secondDimensions);
      });

      // Should still be changing
      expect(result.current.isChanging).toBe(true);

      // Complete the debounce for second change
      act(() => {
        jest.advanceTimersByTime(ORIENTATION_CHANGE_DEBOUNCE);
      });

      // Should be done changing and have second dimensions
      expect(result.current.isChanging).toBe(false);
      expect(result.current.window).toEqual(secondDimensions.window);
    });
  });

  describe('Manual Workspace Updates', () => {
    it('updates workspace screenBounds manually with current dimensions', () => {
      const { result } = renderHook(() =>
        useWorkspaceDimensions({
          workspace: mockWorkspace,
        })
      );

      // Clear initial call
      mockWorkspace.setScreenBounds.mockClear();

      act(() => {
        result.current.updateWorkspaceScreenBounds();
      });

      expect(mockWorkspace.setScreenBounds).toHaveBeenCalledWith({
        x: 0,
        y: 0,
        width: mockWindowDimensions.width,
        height: mockWindowDimensions.height,
      });
    });

    it('updates workspace screenBounds manually with custom bounds', () => {
      const { result } = renderHook(() =>
        useWorkspaceDimensions({
          workspace: mockWorkspace,
        })
      );

      const customBounds = {
        x: 100,
        y: 50,
        width: 800,
        height: 600,
      };

      act(() => {
        result.current.updateWorkspaceScreenBounds(customBounds);
      });

      expect(mockWorkspace.setScreenBounds).toHaveBeenCalledWith(customBounds);
    });

    it('updates workspace screenBounds with partial bounds (defaults x, y to 0)', () => {
      const { result } = renderHook(() =>
        useWorkspaceDimensions({
          workspace: mockWorkspace,
        })
      );

      const partialBounds = {
        width: 800,
        height: 600,
      };

      act(() => {
        result.current.updateWorkspaceScreenBounds(partialBounds);
      });

      expect(mockWorkspace.setScreenBounds).toHaveBeenCalledWith({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      });
    });

    it('does nothing when no workspace provided', () => {
      const { result } = renderHook(() => useWorkspaceDimensions());

      act(() => {
        result.current.updateWorkspaceScreenBounds();
      });

      // Should not throw
      expect(mockWorkspace.setScreenBounds).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('removes event listener on unmount', () => {
      const mockRemove = jest.fn();
      mockDimensions.addEventListener.mockReturnValue(
        createMockSubscription(mockRemove)
      );

      const { unmount } = renderHook(() => useWorkspaceDimensions());

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });

    it('clears debounce timer on unmount', () => {
      let changeHandler: DimensionChangeHandler | undefined;
      const mockRemove = jest.fn();

      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return createMockSubscription(mockRemove);
      });

      const { result, unmount } = renderHook(() => useWorkspaceDimensions());

      // Start a dimension change
      act(() => {
        changeHandler?.({
          window: { width: 414, height: 896, scale: 3, fontScale: 1 },
          screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
        });
      });

      expect(result.current.isChanging).toBe(true);

      // Unmount before debounce completes
      unmount();

      // Advance timer - should not cause issues
      act(() => {
        jest.advanceTimersByTime(ORIENTATION_CHANGE_DEBOUNCE);
      });

      // Should not throw or cause memory leaks
    });

    it('handles missing remove function gracefully', () => {
      mockDimensions.addEventListener.mockReturnValue(
        null as unknown as EmitterSubscription
      );

      const { unmount } = renderHook(() => useWorkspaceDimensions());

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined workspace gracefully', () => {
      const { result } = renderHook(() =>
        useWorkspaceDimensions({
          workspace: undefined,
          autoUpdateWorkspace: true,
        })
      );

      expect(result.current.orientationState).toEqual(mockOrientationState);
      expect(() => {
        result.current.updateWorkspaceScreenBounds();
      }).not.toThrow();
    });

    it('handles workspace changes during component lifecycle', () => {
      const { result, rerender } = renderHook(
        ({ workspace }: { workspace?: WorkspaceInterface }) =>
          useWorkspaceDimensions({ workspace }),
        { initialProps: { workspace: undefined } }
      );

      // Initially no workspace
      act(() => {
        result.current.updateWorkspaceScreenBounds();
      });

      expect(mockWorkspace.setScreenBounds).not.toHaveBeenCalled();

      // Add workspace
      rerender({ workspace: mockWorkspace });

      act(() => {
        result.current.updateWorkspaceScreenBounds();
      });

      expect(mockWorkspace.setScreenBounds).toHaveBeenCalled();
    });

    it('handles zero debounce delay', () => {
      let changeHandler: DimensionChangeHandler | undefined;
      const mockRemove = jest.fn();

      mockDimensions.addEventListener.mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
        return createMockSubscription(mockRemove);
      });

      const { result } = renderHook(() =>
        useWorkspaceDimensions({
          debounceDelay: 0,
        })
      );

      const newDimensions = {
        window: { width: 414, height: 896, scale: 3, fontScale: 1 },
        screen: { width: 414, height: 896, scale: 3, fontScale: 1 },
      };

      act(() => {
        changeHandler?.(newDimensions);
        jest.advanceTimersByTime(0);
      });

      expect(result.current.isChanging).toBe(false);
    });
  });
});
