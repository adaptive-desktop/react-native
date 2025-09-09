import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  WorkspaceFactory,
  Viewport,
} from '@adaptive-desktop/adaptive-workspace';
import { WorkspaceView } from '../components';
import { createWorkspaceConfig } from '../utils';

export const AdaptiveDesktopDemo: React.FC = () => {
  const dimensions = Dimensions.get('window');

  const [workspace] = useState(() => {
    const ws = WorkspaceFactory.create(
      createWorkspaceConfig({
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
      })
    );

    // Create initial viewport for the main content area
    ws.createViewport();

    return ws;
  });

  return (
    <View style={styles.container}>
      <WorkspaceView workspace={workspace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
});
