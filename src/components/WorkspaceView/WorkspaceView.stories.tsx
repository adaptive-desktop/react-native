import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { WorkspaceView } from './WorkspaceView';

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
      const ws = WorkspaceFactory.create({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      });

      // Create initial viewport
      ws.createViewport();

      return ws;
    })(),
    style: {
      backgroundColor: '#808080', // Simple gray background
    },
  },
};

// Interactive story that demonstrates updateScreenPosition
const DynamicWorkspaceDemo = () => {
  const [workspace] = useState(() => {
    const ws = WorkspaceFactory.create({
      x: 50,
      y: 50,
      width: 600,
      height: 400,
    });

    // Create initial viewport
    ws.createViewport();

    return ws;
  });

  const [, forceUpdate] = useState({});

  const updatePosition = (x: number, y: number, width: number, height: number) => {
    workspace.updateScreenBounds({ x, y, width, height });
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
            <Text style={styles.buttonText}>Small Center</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.largeButton]}
          onPress={() => updatePosition(25, 25, 750, 500)}
        >
          <Text style={styles.buttonText}>Large Workspace</Text>
        </TouchableOpacity>
      </View>

      <WorkspaceView
        workspace={workspace}
        style={styles.workspace}
      />
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

export const DynamicPosition: Story = {
  render: () => <DynamicWorkspaceDemo />,
};
