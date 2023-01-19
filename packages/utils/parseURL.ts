import { Vector3 } from 'three';

/**
 * // Parse a string like "1,2,3" into a Vector3
 * @param arr a string that conforms to '%d,%d,%d'
 * @returns ThreeJS Vector3
 */
function parseVector(arr: string) {
  const [x, y, z] = arr.split(',').map((n) => parseFloat(n));

  if (x && y && z) {
    return new Vector3(x, y, z);
  }

  return undefined;
}

/**
 * @param str a string that is either 'yes' or 'no' or null
 * @returns true if and only if `str` is 'yes'
 */
export function parseIsTrue(str: string | null) {
  if (!str) return false;

  return str.toLowerCase() === 'true';
}

export interface CameraSettings {
  position?: Vector3;
  isPerspectiveCamera?: boolean;
  enablePan?: boolean;
  distance?: number;
  zoom: number;
}

/**
 * Default: {position: {x: 1, y: 1, z: 1}, isPerspectiveCamera: false, enablePan: false, distance: 30, zoom: 30
 * @param params URLSearchParams object
 * @returns CameraSettings
 */
export function parseCameraSettings(params: URLSearchParams): CameraSettings {
  return {
    position: parseVector(params.get('position') || ''),
    isPerspectiveCamera: parseIsTrue(params.get('isPerspectiveCamera')),
    enablePan: parseIsTrue(params.get('enablePan')),
    distance: parseFloat(params.get('distance') || ''),
    zoom: parseFloat(params.get('zoom') || '')
  };
}
