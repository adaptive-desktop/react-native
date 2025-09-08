import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Viewport } from '@adaptive-desktop/adaptive-workspace';

export interface ViewportViewProps {
  viewport: Viewport;

  // React Native specific props
  style?: ViewStyle;
  testID?: string;

  // Children to render inside the viewport
  children?: React.ReactNode;
}

export const ViewportView = ({
  viewport,
  style,
  testID,
  children,
}: ViewportViewProps) => {
  const containerStyle: ViewStyle = {
    position: 'absolute',
    left: viewport.screenBounds.x,
    top: viewport.screenBounds.y,
    width: viewport.screenBounds.width,
    height: viewport.screenBounds.height,
  };

  return (
    <View style={[styles.container, containerStyle, style]} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});
