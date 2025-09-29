import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  WorkspaceFactory,
  WorkspaceInterface,
} from '@adaptive-desktop/adaptive-workspace';
import { loadDesktopSnapshot } from '@adaptive-desktop/adaptive-workspace';
import { WorkspaceView } from './WorkspaceView';
import { idGenerator } from '../../utils/idGenerator';

// Mock safe area context
const MockSafeAreaProvider = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider
    initialMetrics={{
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
      frame: { x: 0, y: 0, width: 0, height: 0 },
    }}
  >
    {children}
  </SafeAreaProvider>
);

describe('WorkspaceView', () => {
  const createTestWorkspace = (
    x = 0,
    y = 0,
    width = 800,
    height = 600
  ): WorkspaceInterface => {
    const factory = new WorkspaceFactory(idGenerator);
    const snapshot = loadDesktopSnapshot();
    // Override screen bounds for test
    return factory.fromSnapshot(snapshot, { x, y, width, height });
  };

  const renderWorkspaceView = (workspace: WorkspaceInterface, props = {}) => {
    return render(
      <MockSafeAreaProvider>
        <WorkspaceView workspace={workspace} {...props} />
      </MockSafeAreaProvider>
    );
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const workspace = createTestWorkspace();
      expect(() => renderWorkspaceView(workspace)).not.toThrow();
    });

    it('applies custom styles', () => {
      const workspace = createTestWorkspace();
      const customStyle = { backgroundColor: '#ff0000' };

      const { getByTestId } = render(
        <MockSafeAreaProvider>
          <WorkspaceView
            workspace={workspace}
            style={customStyle}
            testID="workspace-view"
          />
        </MockSafeAreaProvider>
      );

      const container = getByTestId('workspace-view');
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });
  });

  // WorkspaceView is now a pure background container; integration tests for viewport rendering are handled elsewhere.


});
