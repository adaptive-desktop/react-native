import type React from 'react';
import type { ViewStyle } from 'react-native';

export type SplitDirection = 'up' | 'down' | 'left' | 'right';

export interface PanelProps {
  title?: string;
  isMinimized?: boolean;
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onRestore?: () => void;
  onMaximize?: () => void;
  onSplit?: (dir: SplitDirection) => void;
  headerControlsPosition?: 'right' | 'left';
  testID?: string;
  children?: React.ReactNode;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  style?: ViewStyle;
}
