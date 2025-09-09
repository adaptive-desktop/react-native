import uuid from 'react-native-uuid';

/**
 * ID generator implementation using react-native-uuid for adaptive-workspace v0.5.0
 */
export const idGenerator = {
  generate: (): string => {
    return uuid.v4() as string;
  },
};

/**
 * Default configuration for WorkspaceFactory that includes the ID generator
 */
export const createWorkspaceConfig = (bounds: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => ({
  ...bounds,
  idGenerator,
});
