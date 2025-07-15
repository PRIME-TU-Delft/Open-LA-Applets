import type { Vector3 } from 'three';

export type Camera3DProps = {
  cameraPosition?: Vector3;
  enablePan?: boolean;
  cameraZoom?: number;
  isSplit?: boolean;
};
