import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { ViewportView } from './ViewportView';
import { Panel } from '../Panel';
import { loadDesktopSnapshot } from '@adaptive-desktop/adaptive-workspace';
import { idGenerator } from '../../utils';

const meta: Meta<typeof ViewportView> = {
  title: 'Components/ViewportView',
  component: ViewportView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Get a viewport from the snapshot-based workspace
const getFirstViewport = () => {
  const snapshot = loadDesktopSnapshot();
  const context = snapshot.workspaceContexts[0];
  const factory = new WorkspaceFactory(idGenerator);
  const workspace = factory.fromSnapshot(snapshot, context.maxScreenBounds);
  return workspace.viewports.values().next().value;
};

export const Default: Story = {
  args: {
    viewport: getFirstViewport(),
    style: {
      backgroundColor: '#2d2d2d',
      borderWidth: 1,
      borderColor: '#555',
    },
  },
  render: args => {
    if (!args.viewport) {
      return (
        <View>
          <Text>No viewport found in snapshot.</Text>
        </View>
      );
    }
    return (
      <View style={styles.storyContainer}>
        <ViewportView {...args}>
          <View style={styles.content}>
            <Text style={styles.title}>Viewport Content</Text>
            <Text style={styles.subtitle}>
              ID: {args.viewport.id.slice(-6)}
            </Text>
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
    );
  },
};

export const WithCustomContent: Story = {
  render: () => {
    const viewport = getFirstViewport();
    if (!viewport) {
      return (
        <View>
          <Text>No viewport found in snapshot.</Text>
        </View>
      );
    }
    // We don't have a workspace instance here, so Panel actions will be no-ops
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
          <Panel title="Panel" onClose={() => {}} onSplit={() => {}}>
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

// Remove MultipleViewports story, as it relied on createStaticViewport

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
// Remove DynamicViewportDemo and related story, as it relied on createStaticViewport

// dynamicStyles variable removed as it was unused
// Removed dynamicStyles variable as it was unused
