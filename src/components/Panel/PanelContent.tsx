import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { PanelProps } from './types';

export const PanelContent: React.FC<
  Pick<PanelProps, 'children' | 'isMinimized' | 'contentStyle'>
> = ({ children, isMinimized, contentStyle }) => {
  if (isMinimized) return null;
  return <View style={[styles.container, contentStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
