import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const CloseButton: React.FC<
  { onPress?: () => void } & { testID?: string }
> = ({ onPress, testID = 'panel-close' }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel="Close panel"
    style={styles.btn}
    onPress={onPress}
    testID={testID}
  >
    <Text style={styles.txt}>×</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#3a3a3a',
  },
  txt: { color: '#fff', fontSize: 14 },
});
