import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PanelProps } from './types';
import { CloseButton } from './controls/CloseButton';
import { MinimizeButton } from './controls/MinimizeButton';
import { MaximizeButton } from './controls/MaximizeButton';
import { SplitDownButton } from './controls/SplitDown';
import { SplitRightButton } from './controls/SplitRightButton';

export interface PanelHeaderProps
  extends Pick<
    PanelProps,
    | 'title'
    | 'isMinimized'
    | 'isMaximized'
    | 'onClose'
    | 'onMinimize'
    | 'onRestore'
    | 'onMaximize'
    | 'onSplit'
    | 'headerControlsPosition'
  > {
  style?: PanelProps['headerStyle'];
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onRestore,
  onMaximize,
  onSplit,
  headerControlsPosition = 'right',
  style,
}) => {
  const ControlsCluster = (
    <View style={styles.controls}>
      <SplitDownButton onPress={() => onSplit?.('down')} />
      <SplitRightButton onPress={() => onSplit?.('right')} />
      <MinimizeButton
        minimized={!!isMinimized}
        onPress={() => (isMinimized ? onRestore?.() : onMinimize?.())}
      />
      <MaximizeButton
        maximized={!!isMaximized}
        onPress={() => (isMaximized ? onRestore?.() : onMaximize?.())}
      />
      <CloseButton onPress={onClose} />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {headerControlsPosition === 'left' && ControlsCluster}
      <Text numberOfLines={1} style={styles.title}>
        {title ?? ''}
      </Text>
      {headerControlsPosition === 'right' && ControlsCluster}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3a3a3a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
    marginHorizontal: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
