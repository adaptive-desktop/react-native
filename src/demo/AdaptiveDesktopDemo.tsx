import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  WorkspaceFactory,
  loadDesktopSnapshot,
} from '@adaptive-desktop/adaptive-workspace';
import { idGenerator } from '../utils/idGenerator';
import { WorkspaceView } from '../components';
import { useWorkspaceDimensions } from '../hooks';

export const AdaptiveDesktopDemo: React.FC = () => {
  const [workspace] = useState(() => {
    const snapshot = loadDesktopSnapshot();
    const context = snapshot.workspaceContexts[0];
    const factory = new WorkspaceFactory(idGenerator);
    return factory.fromSnapshot(snapshot, context.maxScreenBounds);
  });

  // Use the enhanced hook to automatically handle dimension changes
  useWorkspaceDimensions({
    workspace,
    autoUpdateWorkspace: true,
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
