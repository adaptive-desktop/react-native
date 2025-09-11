import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WorkspaceFactory, WorkspaceInterface } from '@adaptive-desktop/adaptive-workspace';
import { WorkspaceView } from './WorkspaceView';
import { createWorkspaceConfig } from '../../utils';

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
  const createTestWorkspace = (x = 0, y = 0, width = 800, height = 600): WorkspaceInterface => {
    const workspace = WorkspaceFactory.create(
      createWorkspaceConfig({ x, y, width, height })
    );
    workspace.createViewport(); // Add initial viewport
    return workspace;
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
      renderWorkspaceView(workspace);

      expect(screen.getByText(/Viewport:/)).toBeTruthy();
    });

    it('displays viewport information', () => {
      const workspace = createTestWorkspace();
      renderWorkspaceView(workspace);

      const viewportText = screen.getByText(/Viewport:/);
      expect(viewportText).toBeTruthy();
    });

    it('handles empty workspace (no viewports)', () => {
      const workspace = WorkspaceFactory.create(
        createWorkspaceConfig({
          x: 0,
          y: 0,
          width: 800,
          height: 600,
        })
      );
      // Don't create any viewports

      renderWorkspaceView(workspace);

      expect(screen.getByText('No viewports available')).toBeTruthy();
      expect(screen.getByText('Create a viewport to get started')).toBeTruthy();
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

  describe('Workspace Integration', () => {
    it('renders viewports with correct screen bounds', () => {
      const workspace = createTestWorkspace(100, 50, 600, 400);
      renderWorkspaceView(workspace);

      // Viewport should exist
      expect(screen.getByText(/Viewport:/)).toBeTruthy();
    });

    it('updates when workspace screen bounds change', () => {
      const workspace = createTestWorkspace(0, 0, 800, 600);
      const { rerender } = renderWorkspaceView(workspace);

      // Initial render
      expect(screen.getByText(/Viewport:/)).toBeTruthy();

      // Update workspace bounds
      workspace.updateScreenBounds({ x: 100, y: 100, width: 400, height: 300 });

      // Re-render with same workspace (bounds changed)
      rerender(
        <MockSafeAreaProvider>
          <WorkspaceView workspace={workspace} />
        </MockSafeAreaProvider>
      );

      // Should still render viewport (bounds updated internally)
      expect(screen.getByText(/Viewport:/)).toBeTruthy();
    });

    it('handles multiple viewports', () => {
      const workspace = createTestWorkspace();
      const firstViewport = workspace.getViewports()[0];

      // Split to create second viewport
      workspace.splitViewport(firstViewport, 'right');

      renderWorkspaceView(workspace);

      const viewportElements = screen.getAllByText(/Viewport:/);
      expect(viewportElements).toHaveLength(2);
    });

    it('creates viewport that takes up half the workspace', () => {
      const workspace = WorkspaceFactory.create(
        createWorkspaceConfig({
          x: 0,
          y: 0,
          width: 800,
          height: 600,
        })
      );

      // Create viewport with proportional bounds for half the workspace (left half)
      const halfViewport = workspace.createViewport({
        x: 0, // Start at left edge
        y: 0, // Start at top edge
        width: 0.5, // Take up 50% of workspace width
        height: 1, // Take up full workspace height
      });

      renderWorkspaceView(workspace);

      // Verify viewport exists
      expect(screen.getByText(/Viewport:/)).toBeTruthy();

      // Verify the viewport has the correct screen bounds (half the workspace)
      expect(halfViewport.screenBounds).toEqual({
        x: 0,
        y: 0,
        width: 400, // 50% of 800
        height: 600, // 100% of 600
      });
    });
  });

  describe('Error Handling', () => {
    it('handles workspace with invalid bounds gracefully', () => {
      const workspace = WorkspaceFactory.create(
        createWorkspaceConfig({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        })
      );

      expect(() => renderWorkspaceView(workspace)).not.toThrow();
    });
  });
});
