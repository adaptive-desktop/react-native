import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WorkspaceInterface } from '@adaptive-desktop/adaptive-workspace';

export interface WorkspaceViewProps {
  workspace: WorkspaceInterface;

  // React Native specific props
  style?: ViewStyle;
  testID?: string;
}

export const WorkspaceView = ({
  workspace,
  style,
  testID,
}: WorkspaceViewProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      },
      style,
    ],
    [safeAreaInsets, style]
  );

  const viewports = useMemo(
    () => workspace.getViewports(),
    [workspace.screenBounds]
  );

  return (
    <View style={containerStyle} testID={testID}>
      {viewports.length === 0 ? (
        <View style={styles.emptyContainer}></View>
      ) : (
        <View style={styles.viewportsContainer}>
          {viewports.map(viewport => {
            const viewportStyle: ViewStyle = {
              position: 'absolute',
              left: viewport.screenBounds.x,
              top: viewport.screenBounds.y,
              width: viewport.screenBounds.width,
              height: viewport.screenBounds.height,
              backgroundColor: '#2d2d2d',
              borderWidth: 1,
              borderColor: '#333',
            };

            return <View key={viewport.id} style={viewportStyle}></View>;
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center',
  },
  viewportsContainer: {
    flex: 1,
    position: 'relative',
  },
  viewportText: {
    color: '#ffffff',
    fontSize: 14,
    padding: 10,
  },
});
