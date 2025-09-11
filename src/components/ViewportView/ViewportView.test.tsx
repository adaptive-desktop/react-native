import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { ViewportView } from './ViewportView';
import { createWorkspaceConfig } from '../../utils';

describe('ViewportView', () => {
  const createTestViewport = (x = 0, y = 0, width = 400, height = 300) => {
    const workspace = WorkspaceFactory.create(
      createWorkspaceConfig({ x, y, width, height })
    );
    return workspace.createViewport();
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const viewport = createTestViewport();
      render(<ViewportView viewport={viewport} />);
    });

    it('applies viewport screen bounds as position and size', () => {
      const viewport = createTestViewport(100, 50, 600, 400);

      const { getByTestId } = render(
        <ViewportView viewport={viewport} testID="viewport-view" />
      );

      const container = getByTestId('viewport-view');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            position: 'absolute',
            left: 100,
            top: 50,
            width: 600,
            height: 400,
          }),
        ])
      );
    });

    it('renders children inside the viewport', () => {
      const viewport = createTestViewport();

      render(
        <ViewportView viewport={viewport}>
          <Text>Test Content</Text>
        </ViewportView>
      );

      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('applies custom styles', () => {
      const viewport = createTestViewport();
      const customStyle = { backgroundColor: '#ff0000', borderWidth: 2 };

      const { getByTestId } = render(
        <ViewportView
          viewport={viewport}
          style={customStyle}
          testID="viewport-view"
        />
      );

      const container = getByTestId('viewport-view');
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });

    it('handles different viewport positions and sizes', () => {
      const viewport1 = createTestViewport(0, 0, 200, 150);
      const viewport2 = createTestViewport(200, 150, 300, 250);

      const { getByTestId: getByTestId1 } = render(
        <ViewportView viewport={viewport1} testID="viewport-1" />
      );

      const { getByTestId: getByTestId2 } = render(
        <ViewportView viewport={viewport2} testID="viewport-2" />
      );

      const container1 = getByTestId1('viewport-1');
      const container2 = getByTestId2('viewport-2');

      expect(container1.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            left: 0,
            top: 0,
            width: 200,
            height: 150,
          }),
        ])
      );

      expect(container2.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            left: 200,
            top: 150,
            width: 300,
            height: 250,
          }),
        ])
      );
    });
  });

  describe('Integration', () => {
    it('works with workspace-created viewports', () => {
      const workspace = WorkspaceFactory.create(
        createWorkspaceConfig({
          x: 50,
          y: 25,
          width: 800,
          height: 600,
        })
      );

      const viewport = workspace.createViewport();

      const { getByTestId } = render(
        <ViewportView viewport={viewport} testID="viewport-view">
          <Text>Workspace Content</Text>
        </ViewportView>
      );

      const container = getByTestId('viewport-view');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            position: 'absolute',
            left: viewport.screenBounds.x,
            top: viewport.screenBounds.y,
            width: viewport.screenBounds.width,
            height: viewport.screenBounds.height,
          }),
        ])
      );

      expect(screen.getByText('Workspace Content')).toBeTruthy();
    });

    it('updates viewport position when workspace bounds change', () => {
      const workspace = WorkspaceFactory.create(
        createWorkspaceConfig({
          x: 0,
          y: 0,
          width: 800,
          height: 600,
        })
      );

      const viewport = workspace.createViewport();

      const { getByTestId, rerender } = render(
        <ViewportView viewport={viewport} testID="viewport-view">
          <Text>Dynamic Content</Text>
        </ViewportView>
      );

      // Initial position
      const initialContainer = getByTestId('viewport-view');
      expect(initialContainer.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            left: 0,
            top: 0,
            width: 800,
            height: 600,
          }),
        ])
      );

      // Update workspace bounds
      workspace.updateScreenBounds({ x: 100, y: 50, width: 400, height: 300 });

      // Re-render with same viewport (bounds changed)
      rerender(
        <ViewportView viewport={viewport} testID="viewport-view">
          <Text>Dynamic Content</Text>
        </ViewportView>
      );

      // Viewport position should have updated
      const updatedContainer = getByTestId('viewport-view');
      expect(updatedContainer.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            left: 100,
            top: 50,
            width: 400,
            height: 300,
          }),
        ])
      );

      expect(screen.getByText('Dynamic Content')).toBeTruthy();
    });

    it('handles multiple viewport position updates', () => {
      const workspace = WorkspaceFactory.create(
        createWorkspaceConfig({
          x: 0,
          y: 0,
          width: 600,
          height: 400,
        })
      );

      const viewport = workspace.createViewport();

      const { getByTestId, rerender } = render(
        <ViewportView viewport={viewport} testID="viewport-view" />
      );

      // Test multiple position updates
      const positions = [
        { x: 50, y: 50, width: 600, height: 400 },
        { x: 200, y: 100, width: 400, height: 300 },
        { x: 25, y: 25, width: 750, height: 500 },
      ];

      positions.forEach((pos) => {
        workspace.updateScreenBounds(pos);

        rerender(<ViewportView viewport={viewport} testID="viewport-view" />);

        const container = getByTestId('viewport-view');
        expect(container.props.style).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              left: pos.x,
              top: pos.y,
              width: pos.width,
              height: pos.height,
            }),
          ])
        );
      });
    });
  });
});
