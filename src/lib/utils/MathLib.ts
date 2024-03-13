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



export function lineLineIntersection(A: Vector2, B: Vector2, C: Vector2, D: Vector2) {
    const  xcd = D.x - C.x;
    const  ycd = D.y - C.y;
    const  xac = A.x - C.x;
    const  yac = A.y - C.y;
    
    const  den = ycd * (B.x - A.x) - xcd * (B.y - A.y);
    const  u0 = (xcd * yac - ycd * xac) / den;
    return new Vector2(A.x + u0 * (B.x - A.x), A.y + u0 * (B.y - A.y));
  }

/**
 * The lineLineIntersection function calculates an intersection point between two lines defined by two point each.
 * projects p onto line in dir of L
 * @param L line
 * @param p point
 * @returns 
 */
  export function OrthogonalProjection(L: Vector2, p: Vector2) {
    return L.clone().multiplyScalar(L.clone().dot(p) / L.clone().dot(L));
  }

