import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const MinimizeButton: React.FC<{
  minimized?: boolean;
  onPress?: () => void;
  testID?: string;
}> = ({ minimized, onPress, testID = 'panel-minimize' }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={minimized ? 'Restore panel' : 'Minimize panel'}
    style={styles.btn}
    onPress={onPress}
    testID={testID}
  >
    <Text style={styles.txt}>{minimized ? '▢' : '▁'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#3a3a3a',
  },
  txt: { color: '#fff', fontSize: 14 },
});
