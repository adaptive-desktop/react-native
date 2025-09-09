import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { ViewportView } from './ViewportView';
import { createWorkspaceConfig } from '../../utils';
import { Panel } from '../Panel';

const meta: Meta<typeof ViewportView> = {
  title: 'Components/ViewportView',
  component: ViewportView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Create a static viewport for the stories
const createStaticViewport = (x = 0, y = 0, width = 400, height = 300) => {
  const workspace = WorkspaceFactory.create(
    createWorkspaceConfig({
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    })
  );

  // Create viewport with specific bounds
  return workspace.createViewport({
    x: x / 800, // Convert to proportional bounds
    y: y / 600,
    width: width / 800,
    height: height / 600,
  });
};

export const Default: Story = {
  args: {
    viewport: createStaticViewport(50, 50, 300, 200),
    style: {
      backgroundColor: '#2d2d2d',
      borderWidth: 1,
      borderColor: '#555',
    },
  },
  render: args => (
    <View style={styles.storyContainer}>
      <ViewportView {...args}>
        <View style={styles.content}>
          <Text style={styles.title}>Viewport Content</Text>
          <Text style={styles.subtitle}>ID: {args.viewport.id.slice(-6)}</Text>
          <Text style={styles.bounds}>
            Position: ({args.viewport.screenBounds.x},{' '}
            {args.viewport.screenBounds.y})
          </Text>
          <Text style={styles.bounds}>
            Size: {args.viewport.screenBounds.width} ×{' '}
            {args.viewport.screenBounds.height}
          </Text>
        </View>
      </ViewportView>
    </View>
  ),
};

export const WithCustomContent: Story = {
  render: () => {
    const workspace = WorkspaceFactory.create(
      createWorkspaceConfig({ x: 0, y: 0, width: 800, height: 600 })
    );
    const viewport = workspace.createViewport({
      x: 100 / 800,
      y: 100 / 600,
      width: 400 / 800,
      height: 250 / 600,
    });

    return (
      <View style={styles.storyContainer}>
        <ViewportView
          viewport={viewport}
          style={{
            backgroundColor: '#1e3a8a',
            borderWidth: 2,
            borderColor: '#3b82f6',
            borderRadius: 8,
          }}
        >
          <Panel
            title="Panel"
            onClose={() => workspace.removeViewport(viewport.id)}
            onSplit={dir => workspace.splitViewport(viewport.id, dir)}
          >
            <View style={styles.customContent}>
              <Text style={styles.customTitle}>Panel Content</Text>
              <Text style={styles.customText}>
                This viewport hosts a Panel component.
              </Text>
            </View>
          </Panel>
        </ViewportView>
      </View>
    );
  },
};

export const MultipleViewports: Story = {
  render: () => {
    const viewport1 = createStaticViewport(50, 50, 200, 150);
    const viewport2 = createStaticViewport(300, 50, 200, 150);
    const viewport3 = createStaticViewport(50, 250, 450, 100);

    return (
      <View style={styles.storyContainer}>
        <ViewportView viewport={viewport1} style={styles.viewport1}>
          <View style={styles.content}>
            <Text style={styles.title}>Viewport 1</Text>
            <Text style={styles.subtitle}>Top Left</Text>
          </View>
        </ViewportView>

        <ViewportView viewport={viewport2} style={styles.viewport2}>
          <View style={styles.content}>
            <Text style={styles.title}>Viewport 2</Text>
            <Text style={styles.subtitle}>Top Right</Text>
          </View>
        </ViewportView>

        <ViewportView viewport={viewport3} style={styles.viewport3}>
          <View style={styles.content}>
            <Text style={styles.title}>Viewport 3</Text>
            <Text style={styles.subtitle}>Bottom Span</Text>
          </View>
        </ViewportView>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  storyContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  bounds: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
  },
  customContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  customTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customText: {
    color: '#e5e7eb',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  placeholder: {
    backgroundColor: '#374151',
    padding: 20,
    borderRadius: 4,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  viewport1: {
    backgroundColor: '#dc2626',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  viewport2: {
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  viewport3: {
    backgroundColor: '#ca8a04',
    borderWidth: 1,
    borderColor: '#eab308',
  },
});

// Dynamic viewport demo that shows how viewport positions change when workspace bounds change
const DynamicViewportDemo = () => {
  const [workspace] = useState(() => {
    const ws = WorkspaceFactory.create(
      createWorkspaceConfig({
        x: 50,
        y: 50,
        width: 600,
        height: 400,
      })
    );

    // Create initial viewport
    ws.createViewport();

    return ws;
  });

  const [, forceUpdate] = useState({});

  const updateWorkspacePosition = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    workspace.updateScreenBounds({ x, y, width, height });
    forceUpdate({}); // Force re-render to show changes
  };

  const viewport = workspace.getViewports()[0];

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.controls}>
        <Text style={dynamicStyles.title}>Dynamic Viewport Position Demo</Text>
        <Text style={dynamicStyles.subtitle}>
          Viewport position changes when workspace bounds change
        </Text>

        <View style={dynamicStyles.buttonRow}>
          <TouchableOpacity
            style={dynamicStyles.button}
            onPress={() => updateWorkspacePosition(50, 50, 600, 400)}
          >
            <Text style={dynamicStyles.buttonText}>Top Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.button}
            onPress={() => updateWorkspacePosition(200, 50, 600, 400)}
          >
            <Text style={dynamicStyles.buttonText}>Top Right</Text>
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.buttonRow}>
          <TouchableOpacity
            style={dynamicStyles.button}
            onPress={() => updateWorkspacePosition(50, 200, 600, 400)}
          >
            <Text style={dynamicStyles.buttonText}>Bottom Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.button}
            onPress={() => updateWorkspacePosition(100, 100, 400, 300)}
          >
            <Text style={dynamicStyles.buttonText}>Small Center</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[dynamicStyles.button, dynamicStyles.largeButton]}
          onPress={() => updateWorkspacePosition(25, 25, 750, 500)}
        >
          <Text style={dynamicStyles.buttonText}>Large Workspace</Text>
        </TouchableOpacity>

        <View style={dynamicStyles.info}>
          <Text style={dynamicStyles.infoText}>
            Workspace: ({workspace.screenBounds.x}, {workspace.screenBounds.y})
            {workspace.screenBounds.width}×{workspace.screenBounds.height}
          </Text>
          <Text style={dynamicStyles.infoText}>
            Viewport: ({viewport.screenBounds.x}, {viewport.screenBounds.y})
            {viewport.screenBounds.width}×{viewport.screenBounds.height}
          </Text>
        </View>
      </View>

      <ViewportView viewport={viewport} style={dynamicStyles.viewport}>
        <View style={dynamicStyles.viewportContent}>
          <Text style={dynamicStyles.viewportTitle}>Dynamic Viewport</Text>
          <Text style={dynamicStyles.viewportText}>
            ID: {viewport.id.slice(-6)}
          </Text>
          <Text style={dynamicStyles.viewportText}>
            Position: ({viewport.screenBounds.x}, {viewport.screenBounds.y})
          </Text>
          <Text style={dynamicStyles.viewportText}>
            Size: {viewport.screenBounds.width} × {viewport.screenBounds.height}
          </Text>
        </View>
      </ViewportView>
    </View>
  );
};

const dynamicStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  controls: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007ACC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  largeButton: {
    alignSelf: 'center',
    minWidth: 150,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  info: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  viewport: {
    backgroundColor: '#2d2d2d',
    borderWidth: 2,
    borderColor: '#007ACC',
    borderRadius: 4,
  },
  viewportContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewportTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  viewportText: {
    color: '#cccccc',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});

export const DynamicPosition: Story = {
  render: () => <DynamicViewportDemo />,
};
