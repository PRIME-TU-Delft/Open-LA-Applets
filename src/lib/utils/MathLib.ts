import { Vector2 } from 'three';

/**
 * The snapPointToLine function calculates the smallest distance from a point to a line.
 * It then returns the closest point on that line if the actual distance is smaller than the required distance
 * @param point The point to check the distance from
 * @param point1_line The first point on the line
 * @param point2_line The second point on the line
 * @param distance The minimum required distance from the point to the line
 * @returns the closest point on the line or null
 */
export function snapPointToLine(point: Vector2, point1_line: Vector2, point2_line: Vector2, distance: number) {
    const a = point1_line.y - point2_line.y;
    const b = point2_line.x - point1_line.x;
    const c = point1_line.x * point2_line.y - point2_line.x * point1_line.y;
    const actual_distance = Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);

    //Calculate the closest point from the line to point q
    const x3 = (b * b * point.x - a * b * point.y - a * c) / (a * a + b * b);
    const y3 = (a * a * point.y - a * b * point.x - b * c) / (a * a + b * b);

    if (actual_distance < distance) {
      return new Vector2(x3, y3)
    }

    return null
}