import { Vector2, Vector3 } from 'three';

/**
 * The snapPointToLine function calculates the smallest distance from a point to a line.
 * It then returns the closest point on that line if the actual distance is smaller than the required distance
 * @param point The point to check the distance from
 * @param point1_line The first point on the line
 * @param point2_line The second point on the line
 * @param distance The minimum required distance from the point to the line
 * @returns the closest point on the line or null
 */
export function snapPointToLine(
  point: Vector2,
  point1_line: Vector2,
  point2_line: Vector2,
  distance: number
) {
  const a = point1_line.y - point2_line.y;
  const b = point2_line.x - point1_line.x;
  const c = point1_line.x * point2_line.y - point2_line.x * point1_line.y;
  const actual_distance = Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);

  //Calculate the closest point from the line to point q
  const x3 = (b * b * point.x - a * b * point.y - a * c) / (a * a + b * b);
  const y3 = (a * a * point.y - a * b * point.x - b * c) / (a * a + b * b);

  if (actual_distance < distance) {
    return new Vector2(x3, y3);
  }
  return null;
}

/**
 * The lineLineIntersection function calculates an intersection point between two lines defined by two point each
 * @param A point defining line 1
 * @param B point defining line 1
 * @param C point defining line 2
 * @param D point defining line 2
 * @returns point of intersection between the two lines
 */

export function lineLineIntersection(A: Vector2, B: Vector2, C: Vector2, D: Vector2) {
  const xcd = D.x - C.x;
  const ycd = D.y - C.y;
  const xac = A.x - C.x;
  const yac = A.y - C.y;
  const den = ycd * (B.x - A.x) - xcd * (B.y - A.y);
  const u0 = (xcd * yac - ycd * xac) / den;
  return new Vector2(A.x + u0 * (B.x - A.x), A.y + u0 * (B.y - A.y));
}

/**
 * Orthogonally projects a point on a line in a given direction
 * @param L direction of line, from the origin
 * @param p point
 * @returns point of projection
 */
export function orthogonalProjection(L: Vector2, p: Vector2) {
  return L.clone().multiplyScalar(L.clone().dot(p) / L.clone().dot(L));
}

/**
 * Given a time parameter t (in range -PI to PI) gives a point on a circle in 3D.
 * @param t time parameter for parametric circle
 * @param radius of circle
 */
export function parametic_point_on_circle_3D(t: number, radius: number) {
  //https://math.stackexchange.com/questions/73237/parametric-equation-of-a-circle-in-3d-space
  //a, b -> plane of circle, need to be perpendicular, currently arent
  //c -> center of circle
  const a = new Vector3(1, 0, 1).normalize();
  const b = new Vector3(1, 1, 0).normalize();
  const c = new Vector3(0, 0, 0);

  const x = c.x + radius * Math.cos(t) * a.x + radius * Math.sin(t) * b.x;
  const y = c.y + radius * Math.cos(t) * a.y + radius * Math.sin(t) * b.y;
  const z = c.z + radius * Math.cos(t) * a.z + radius * Math.sin(t) * b.z;
  return new Vector3(x, y, z);
}
