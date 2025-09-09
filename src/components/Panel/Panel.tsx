import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { PanelProps } from './types';
import { PanelHeader } from './PanelHeader';
import { PanelContent } from './PanelContent';

export const Panel: React.FC<PanelProps> = ({
  title,
  isMinimized = false,
  isMaximized = false,
  onClose,
  onMinimize,
  onRestore,
  onMaximize,
  onSplit,
  headerControlsPosition = 'right',
  testID,
  children,
  headerStyle,
  contentStyle,
  style,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <PanelHeader
        title={title}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        onClose={onClose}
        onMinimize={onMinimize}
        onRestore={onRestore}
        onMaximize={onMaximize}
        onSplit={onSplit}
        headerControlsPosition={headerControlsPosition}
        style={headerStyle}
      />
      <PanelContent isMinimized={isMinimized} contentStyle={contentStyle}>
        {children}
      </PanelContent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
});
