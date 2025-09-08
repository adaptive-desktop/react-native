import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';

const Welcome = () => (
  <View style={styles.container}>
    <Text style={styles.title}>🎉 Adaptive Desktop React Native</Text>
    <Text style={styles.subtitle}>Storybook is working!</Text>
    <Text style={styles.description}>
      This is the component library for building adaptive desktop layouts.
    </Text>
    <View style={styles.features}>
      <Text style={styles.featureTitle}>Features:</Text>
      <Text style={styles.feature}>🏗️ Viewport-Based Layout System</Text>
      <Text style={styles.feature}>📱 Touch-First Design</Text>
      <Text style={styles.feature}>📌 Pinned Panel System</Text>
      <Text style={styles.feature}>🎯 Developer Freedom</Text>
      <Text style={styles.feature}>⚡ Performance Optimized</Text>
      <Text style={styles.feature}>🎨 Professional Interface</Text>
    </View>
    <Text style={styles.note}>
      Browse the stories in the sidebar to explore the components!
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#007ACC',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    maxWidth: 400,
  },
  features: {
    marginBottom: 30,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  feature: {
    fontSize: 14,
    color: '#d4d4d4',
    marginBottom: 5,
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

const meta: Meta<typeof Welcome> = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
