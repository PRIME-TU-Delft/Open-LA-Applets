import {
  BufferGeometry,
  Color,
  LineBasicMaterial,
  PointsMaterial,
  Vector3,
  type Material
} from 'three';

type Materials = LineBasicMaterial | PointsMaterial | Material;

/**
 * Change color of material if color is different
 * @param material Materials {Materials}
 * @param color New color {ColorRepresentation}
 * @returns if color is changed
 */
export function changeColor(material: Materials, color: string): boolean {
  if (!CSS.supports('color', color)) return false;

  const newColor = new Color(color);

  if ('color' in material && !newColor.equals(material.color)) {
    material.color.set(newColor);
    return true;
  }

  return false;
}

/**
 * Change old position with new position only if position is different.
 * @param position Old position
 * @param newPosition New position to replace old position
 * @returns if the position has changed
 */
export function changePosition(position: Vector3, newPosition: Vector3): boolean {
  if (newPosition.equals(position)) return false;

  position.copy(newPosition);
  return true;
}

/**
 * Change the geometry with new points.
 * @param geometry BufferGeometry
 * @param newPoints array of vector3 points to replace the geometry points
 * @returns boolean if the geometry was changed
 */
export function changeBufferPosition(geometry: BufferGeometry, newPoints: Vector3[]): boolean {
  // [Vector(1,2,3), Vector(4,5,6)] => Looks like this in position array [1,2,3,4,5,6]
  const positionArray = geometry.getAttribute('position').array;
  let arraysAreEqual = true;

  // Check validity
  if (positionArray.length % 3 !== 0) return false; // if position array is not a multiple of 3 ie. does not have vector3 array, return

  // Check if position array is the same as newPoints array
  // if they are the same -> do not change anything
  if (positionArray.length / 3 == newPoints.length) {
    for (let i = 0; i < newPoints.length; i++) {
      const p = new Vector3(
        positionArray[i * 3],
        positionArray[i * 3 + 1],
        positionArray[i * 3 + 2]
      );
      if (!p.equals(newPoints[i])) {
        arraysAreEqual = false;
        break;
      }
    }

    if (arraysAreEqual) return false;
  }

  // update geometry points
  geometry.setFromPoints(newPoints);
  return true;
}
