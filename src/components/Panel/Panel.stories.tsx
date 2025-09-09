import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Panel } from './Panel';

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <View style={styles.container}>
      <View style={styles.viewportMock}>
        <Panel title="Panel Title">
          <View style={styles.contentMock}>
            <Text style={{ color: '#fff' }}>Your content here</Text>
          </View>
        </Panel>
      </View>
    </View>
  ),
};

export const Minimized: Story = {
  render: () => (
    <View style={styles.container}>
      <View style={styles.viewportMock}>
        <Panel title="Panel Title" isMinimized />
      </View>
    </View>
  ),
};

export const CustomContentCentered: Story = {
  render: () => (
    <View style={styles.container}>
      <View style={styles.viewportMock}>
        <Panel title="Panel Title" contentStyle={styles.contentMock}>
          <View style={styles.centerCard}>
            <Text style={styles.centerCardTitle}>Centered Content</Text>
            <Text style={styles.centerCardText}>
              This is centered in the Panel content area.
            </Text>
          </View>
        </Panel>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', padding: 16 },
  viewportMock: { flex: 1, borderWidth: 1, borderColor: '#333' },
  contentMock: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerCard: {
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
  },
  centerCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  centerCardText: { color: '#ddd' },
});
