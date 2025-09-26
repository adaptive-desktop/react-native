import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { WorkspaceView } from './WorkspaceView';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { idGenerator } from '../../utils/idGenerator';
import { loadDesktopSnapshot } from '@adaptive-desktop/adaptive-workspace';

const DEVICE_PRESETS = [
  {
    name: 'Ultrawide',
    bounds: { width: 2560, height: 1080 },
    orientations: ['landscape'],
  },
  {
    name: 'Laptop',
    bounds: { width: 1440, height: 900 },
    orientations: ['landscape'],
  },
  {
    name: 'Tablet',
    bounds: { width: 834, height: 1112 },
    orientations: ['portrait', 'landscape'],
  },
  {
    name: 'Phone',
    bounds: { width: 375, height: 812 },
    orientations: ['portrait', 'landscape'],
  },
];

export const WorkspaceView_DevicePresets = () => {
  const [deviceIdx, setDeviceIdx] = useState(0);
  const [orientation, setOrientation] = useState('landscape');

  const device = DEVICE_PRESETS[deviceIdx];
  const bounds =
    orientation === 'portrait'
      ? { width: device.bounds.height, height: device.bounds.width }
      : device.bounds;

  // Memoize workspace creation from snapshot
  const workspace = useMemo(() => {
    const factory = new WorkspaceFactory(idGenerator);
    const snapshot = loadDesktopSnapshot();
    return factory.fromSnapshot(snapshot, { ...bounds, x: 0, y: 0 });
  }, [deviceIdx, orientation]);

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        {DEVICE_PRESETS.map((d, i) => (
          <Button
            key={d.name}
            title={d.name}
            onPress={() => {
              setDeviceIdx(i);
              setOrientation(d.orientations[0]);
            }}
            color={i === deviceIdx ? '#1976d2' : '#888'}
          />
        ))}
        {device.orientations.length > 1 && (
          <Button
            title={`Switch to ${orientation === 'portrait' ? 'landscape' : 'portrait'}`}
            onPress={() =>
              setOrientation(
                orientation === 'portrait' ? 'landscape' : 'portrait'
              )
            }
          />
        )}
      </View>
      <Text style={styles.label}>
        {device.name} ({orientation}) {bounds.width}x{bounds.height}
      </Text>
      <View
        style={[
          styles.viewport,
          { width: bounds.width / 3, height: bounds.height / 3 },
        ]}
      >
        {' '}
        {/* scale for Storybook */}
        <WorkspaceView workspace={workspace} />
      </View>
    </View>
  );
};

export default {
  title: 'WorkspaceView/DevicePresets',
  component: WorkspaceView_DevicePresets,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  controls: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  label: { marginBottom: 8, fontSize: 16 },
  viewport: {
    borderWidth: 2,
    borderColor: '#1976d2',
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
