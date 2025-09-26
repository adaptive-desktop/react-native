import { useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { WorkspaceInterface } from '@adaptive-desktop/adaptive-workspace';
import {
  createOrientationState,
  OrientationState,
  ORIENTATION_CHANGE_DEBOUNCE,
} from '../../utils/orientationUtils';

export interface UseWorkspaceDimensionsOptions {
  /**
   * Workspace instance to automatically update screenBounds
   */
  workspace?: WorkspaceInterface;

  /**
   * Debounce delay for orientation changes (default: 400ms)
   */
  debounceDelay?: number;

  /**
   * Whether to automatically update workspace screenBounds
   */
  autoUpdateWorkspace?: boolean;
}

export interface UseWorkspaceDimensionsReturn {
  /**
   * Current orientation state
   */
  orientationState: OrientationState;

  /**
   * Current window dimensions
   */
  window: ScaledSize;

  /**
   * Current screen dimensions
   */
  screen: ScaledSize;

  /**
   * Whether dimensions are currently changing (during debounce period)
   */
  isChanging: boolean;

  /**
   * Manually update workspace screenBounds
   */
  updateWorkspaceScreenBounds: (bounds?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  }) => void;
}

/**
 * Enhanced hook that combines dimension tracking with workspace screenBounds updates
 * Automatically detects orientation changes and updates workspace layout
 */
export const useWorkspaceDimensions = (
  options: UseWorkspaceDimensionsOptions = {}
): UseWorkspaceDimensionsReturn => {
  const {
    workspace,
    debounceDelay = ORIENTATION_CHANGE_DEBOUNCE,
    autoUpdateWorkspace = true,
  } = options;

  // Current dimensions state
  const [dimensions, setDimensions] = useState(() => ({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  }));

  // Orientation state derived from dimensions
  const [orientationState, setOrientationState] = useState(() =>
    createOrientationState(dimensions.window, dimensions.screen)
  );

  // Track if dimensions are currently changing (during debounce)
  const [isChanging, setIsChanging] = useState(false);

  // Debounce timer ref
  const debounceTimerRef = useRef<number | null>(null);

  // Update workspace screenBounds manually
  const updateWorkspaceScreenBounds = useCallback(
    (bounds?: { width: number; height: number; x?: number; y?: number }) => {
      if (!workspace) return;

      const screenBounds = bounds || {
        x: 0,
        y: 0,
        width: dimensions.window.width,
        height: dimensions.window.height,
      };

      workspace.setScreenBounds({
        x: screenBounds.x || 0,
        y: screenBounds.y || 0,
        width: screenBounds.width,
        height: screenBounds.height,
      });
    },
    [workspace, dimensions.window]
  );

  // Debounced orientation update
  const updateOrientationState = useCallback(
    (newWindow: ScaledSize, newScreen: ScaledSize) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        // eslint-disable-next-line no-undef
        clearTimeout(debounceTimerRef.current);
      }

      setIsChanging(true);

      // Set up new debounced update
      // eslint-disable-next-line no-undef
      debounceTimerRef.current = setTimeout(() => {
        const newOrientationState = createOrientationState(
          newWindow,
          newScreen
        );
        setOrientationState(newOrientationState);
        setIsChanging(false);

        // Auto-update workspace if enabled
        if (autoUpdateWorkspace && workspace) {
          workspace.setScreenBounds({
            x: 0,
            y: 0,
            width: newWindow.width,
            height: newWindow.height,
          });
        }

        debounceTimerRef.current = null;
      }, debounceDelay) as unknown as number;
    },
    [debounceDelay, autoUpdateWorkspace, workspace]
  );

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        // Update dimensions immediately for responsive UI
        setDimensions({ window, screen });

        // Update orientation state with debouncing
        updateOrientationState(window, screen);
      }
    );

    return () => {
      subscription?.remove();

      // Clean up debounce timer
      if (debounceTimerRef.current) {
        // eslint-disable-next-line no-undef
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [updateOrientationState]);

  // Initialize workspace screenBounds on mount
  useEffect(() => {
    if (autoUpdateWorkspace && workspace) {
      updateWorkspaceScreenBounds();
    }
  }, [autoUpdateWorkspace, workspace, updateWorkspaceScreenBounds]);

  return {
    orientationState,
    window: dimensions.window,
    screen: dimensions.screen,
    isChanging,
    updateWorkspaceScreenBounds,
  };
};
