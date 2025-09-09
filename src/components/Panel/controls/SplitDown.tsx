import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const SplitDownButton: React.FC<{
  onPress?: () => void;
  testID?: string;
}> = ({ onPress, testID = 'panel-split-down' }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel="Split down"
    style={styles.btn}
    onPress={onPress}
    testID={testID}
  >
    <Text style={styles.txt}>\u2193</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#3a3a3a',
    marginRight: 4,
  },
  txt: { color: '#fff', fontSize: 14 },
});
