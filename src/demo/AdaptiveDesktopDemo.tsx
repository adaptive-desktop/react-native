import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { idGenerator } from '../utils/idGenerator';
import { WorkspaceView } from '../components';
import { createWorkspaceConfig } from '../utils';

export const AdaptiveDesktopDemo: React.FC = () => {
  const dimensions = Dimensions.get('window');

  const [workspace] = useState(() => {
    const factory = new WorkspaceFactory(idGenerator);
    const ws = factory.create();
    ws.screenBounds = {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    };
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
