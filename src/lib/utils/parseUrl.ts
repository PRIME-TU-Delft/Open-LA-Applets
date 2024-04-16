import { cameraStore } from '$lib/stores/cameraStore';
import { Vector2, Vector3 } from 'three';

/**
 * Sets the position of the camera based on the provided search parameters.
 * @param {URLSearchParams} searchParams - The search parameters containing the camera position.
 */
export function setPosition(searchParams: URLSearchParams) {
  const keys = ['position3D', 'position3d', 'position', 'position2D', 'position2d'];

  for (const key of keys) {
    const searchKey = searchParams.get(key);

    if (searchKey) {
      const position = searchKey.split(',').map(Number);

      if (position.length === 3) {
        const position3D = new Vector3(...position);
        cameraStore.updatePartialState({ position3D });
      } else if (position.length === 2) {
        const position2D = new Vector2(...position);
        cameraStore.updatePartialState({ position2D });
      }
    }
  }
}

/**
 * Sets the zoom level for the camera based on the provided search parameters.
 * @param {URLSearchParams} searchParams - The search parameters containing the zoom level.
 * @param {number} dimension - The dimension of the camera (2D or 3D). Default is 3.
 * @param {string[]} keys - The keys to check for the zoom level in the search parameters. Default is ['zoom', 'zoom3D', 'zoom3d'].
 */
export function setZoom(
  searchParams: URLSearchParams,
  dimension = 3,
  keys: string[] = ['zoom', 'zoom3D', 'zoom3d']
) {
  for (const key of keys) {
    if (searchParams.has(key)) {
      const zoom = Number(searchParams.get(key));

      if (dimension === 2) cameraStore.updatePartialState({ zoom2D: zoom });
      else if (dimension == 3) cameraStore.updatePartialState({ zoom3D: zoom });
    }
  }
}
