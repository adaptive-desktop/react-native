import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { WorkspaceView } from './WorkspaceView';
import { Panel } from '..';
import { loadDesktopSnapshot } from '@adaptive-desktop/adaptive-workspace';
import { idGenerator } from '../../utils';

const meta: Meta<typeof WorkspaceView> = {
  title: 'Components/WorkspaceView',
  component: WorkspaceView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    workspace: (() => {
      const snapshot = loadDesktopSnapshot();
      const context = snapshot.workspaceContexts[0];
      const factory = new WorkspaceFactory(idGenerator);
      return factory.fromSnapshot(snapshot, context.maxScreenBounds);
    })(),
    style: {
      backgroundColor: '#808080',
    },
  },
};

// Interactive story that demonstrates updateScreenPosition
const DynamicWorkspaceDemo = () => {
  const [workspace] = useState(() => {
    const snapshot = loadDesktopSnapshot();
    // Use the 'laptop' context for a smaller workspace
    const context =
      snapshot.workspaceContexts.find(ctx => ctx.id === 'laptop') ||
      snapshot.workspaceContexts[0];
    const factory = new WorkspaceFactory(idGenerator);
    return factory.fromSnapshot(snapshot, context.maxScreenBounds);
  });

  const [, forceUpdate] = useState({});

  const updatePosition = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    workspace.setScreenBounds({ x, y, width, height });
    forceUpdate({}); // Force re-render to show changes
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Text style={styles.title}>Workspace Position Demo</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updatePosition(50, 50, 600, 400)}
          >
            <Text style={styles.buttonText}>Top Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updatePosition(200, 50, 600, 400)}
          >
            <Text style={styles.buttonText}>Top Right</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updatePosition(50, 200, 600, 400)}
          >
            <Text style={styles.buttonText}>Bottom Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updatePosition(100, 100, 400, 300)}
          >
            <Text style={styles.buttonText}>Bottom Right</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.largeButton]}
          onPress={() => updatePosition(25, 25, 750, 500)}
        >
          <Text style={styles.buttonText}>Large Workspace</Text>
        </TouchableOpacity>
      </View>

      <WorkspaceView workspace={workspace} style={styles.workspace} />
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 15,
    textAlign: 'center',
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
  workspace: {
    backgroundColor: '#808080',
  },
});

export const HalfWorkspace: Story = {
  render: () => {
    const snapshot = loadDesktopSnapshot();
    const context = snapshot.workspaceContexts[0];
    const factory = new WorkspaceFactory(idGenerator);
    const workspace = factory.fromSnapshot(snapshot, context.maxScreenBounds);
    // Use the first viewport from the snapshot
    const viewport = workspace.viewports.values().next().value;
    if (!viewport) {
      return (
        <View>
          <Text>No viewport found in snapshot.</Text>
        </View>
      );
    }
    return (
      <View style={halfWorkspaceStyles.container}>
        <Text style={halfWorkspaceStyles.title}>Half Workspace Demo</Text>
        <Text style={halfWorkspaceStyles.description}>
          Workspace (gray) with viewport (blue) taking up left half
        </Text>
        <View style={halfWorkspaceStyles.workspaceContainer}>
          <View
            style={[
              halfWorkspaceStyles.viewport,
              {
                left: viewport.screenBounds.x,
                top: viewport.screenBounds.y,
                width: viewport.screenBounds.width,
                height: viewport.screenBounds.height,
              },
            ]}
          >
            <Panel
              title="Left Panel"
              onClose={() => workspace.removeViewport(viewport.id)}
              onSplit={dir => workspace.splitViewport(viewport.id, dir)}
            >
              <View style={halfWorkspaceStyles.viewportContent}>
                <Text style={halfWorkspaceStyles.viewportTitle}>
                  Panel Content
                </Text>
                <Text style={halfWorkspaceStyles.viewportText}>
                  ID: {viewport.id.slice(-6)}
                </Text>
                <Text style={halfWorkspaceStyles.viewportText}>
                  Size: {viewport.screenBounds.width} ×{' '}
                  {viewport.screenBounds.height}
                </Text>
                <Text style={halfWorkspaceStyles.viewportText}>
                  50% of workspace width
                </Text>
              </View>
            </Panel>
          </View>
        </View>
      </View>
    );
  },
};

const halfWorkspaceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  workspaceContainer: {
    width: 800,
    height: 600,
    backgroundColor: '#808080', // Gray workspace background
    borderWidth: 2,
    borderColor: '#666',
    position: 'relative',
    alignSelf: 'center',
  },
  viewport: {
    position: 'absolute',
    backgroundColor: '#3b82f6', // Blue viewport background
    borderWidth: 2,
    borderColor: '#1d4ed8',
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
    color: '#e5e7eb',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
});

export const DynamicPosition: Story = {
  render: () => <DynamicWorkspaceDemo />,
};
