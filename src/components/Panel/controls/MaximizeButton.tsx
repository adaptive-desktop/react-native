import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const MaximizeButton: React.FC<{
  maximized?: boolean;
  onPress?: () => void;
  testID?: string;
}> = ({ maximized, onPress, testID = 'panel-maximize' }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={maximized ? 'Restore panel' : 'Maximize panel'}
    style={styles.btn}
    onPress={onPress}
    testID={testID}
  >
    <Text style={styles.txt}>{maximized ? '🗗' : '🗖'}</Text>
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
