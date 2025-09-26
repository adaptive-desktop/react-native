import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import { idGenerator } from '../../utils/idGenerator';

export function getWorkspaceFactory() {
  return new WorkspaceFactory(idGenerator);
}
