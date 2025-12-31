import { Vector2, Vector3 } from 'three';

/**
 * round to a certain number of decimal places
 * @param x - number to round
 * @param precision - number of decimal places, defaults to 2
 * @returns rounded number
 */
export function round(x: number, precision = 2) {
  const factor = Math.pow(10, precision);
  return Math.round(x * factor) / factor;
}

export function roundString(x: number, precision = 2) {
  return round(x, precision).toString();
}

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
  return point;
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
 * Orthogonally projects a point on an infinite line with a given direction and point on line (origin)
 * @param point: point to project
 * @param origin : point on line
 * @param direction direction of line
 * @returns point of projection
 */
export function orthogonalProjectionWithOffset(
  point: Vector2,
  origin: Vector2,
  direction: Vector2
): Vector2 {
  // Destructure the point, origin, and direction into their components
  const [Px, Py] = point;
  const [Ox, Oy] = origin;
  const [Dx, Dy] = direction;

  // Step 1: Calculate the vector OP from O to P
  const OPx = Px - Ox;
  const OPy = Py - Oy;

  // Step 2: Calculate the dot product of OP and D
  const dotProduct = OPx * Dx + OPy * Dy;

  // Step 3: Calculate the magnitude squared of D
  const directionMagnitudeSquared = Dx * Dx + Dy * Dy;

  // Step 4: Calculate the projection factor
  const projectionFactor = dotProduct / directionMagnitudeSquared;

  // Step 5: Scale the direction vector by the projection factor
  const projectionDx = projectionFactor * Dx;
  const projectionDy = projectionFactor * Dy;

  // Step 6: Calculate the projection point by adding the scaled direction to the origin
  const projectionPoint: Vector2 = new Vector2(Ox + projectionDx, Oy + projectionDy);

  return projectionPoint;
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

export function leastSquaresLine(points: Vector2[]) {
  // calc x and y vals summes
  const sumX = points
    .map((p) => p.x)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const sumY = points
    .map((p) => p.y)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  // cals xy summed
  const sumXY = points
    .map((p) => p.x * p.y)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  // calc x^2 summed
  const sumXX = points
    .map((p) => p.x * p.x)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const N = points.length;

  const m = (N * sumXY - sumX * sumY) / (N * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / N;

  //p2 at x=5
  const y2 = m * 5 + b;

  return [new Vector2(0, b), new Vector2(5, y2)];
}

/**
 * Numerically integrates a function using adaptive Simpson's rule
 * @param func - Expression to integrate
 * @param a - Lower bound of integration
 * @param b - Upper bound of integration
 * @param tolerance - Error tolerance (default: 1e-8)
 * @returns Approximate value of the integral
 */
export function integral(
  f: (_: number) => number,
  a: number,
  b: number,
  tolerance: number = 1e-8
): number {
  const maxDepth = 25;
  const maxEvaluations = 8000;
  const blowupThreshold = 1e12;
  let evalCount = 0;

  const safeEval = (x: number) => {
    const v = f(x);
    evalCount++;
    if (evalCount > maxEvaluations) return NaN;
    if (!Number.isFinite(v)) return NaN;
    if (Math.abs(v) > blowupThreshold) return NaN;
    return v;
  };

  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;

  // Simpson's rule for a single interval [a, b]
  const simpsonRule = (a: number, b: number, fa: number, fm: number, fb: number): number => {
    return ((b - a) / 6) * (fa + 4 * fm + fb);
  };

  // Recursive adaptive Simpson's rule
  const adaptiveSimpson = (
    a: number,
    b: number,
    tolerance: number,
    fa: number,
    fm: number,
    fb: number,
    whole: number,
    depth: number
  ): number => {
    if (
      !Number.isFinite(fa) ||
      !Number.isFinite(fm) ||
      !Number.isFinite(fb) ||
      Math.abs(fa) > blowupThreshold ||
      Math.abs(fm) > blowupThreshold ||
      Math.abs(fb) > blowupThreshold
    )
      return NaN;

    if (depth > maxDepth || evalCount > maxEvaluations) return NaN;

    const m = (a + b) / 2;
    const lm = (a + m) / 2;
    const rm = (m + b) / 2;

    const flm = safeEval(lm);
    const frm = safeEval(rm);

    if (!Number.isFinite(flm) || !Number.isFinite(frm)) return NaN;

    const left = simpsonRule(a, m, fa, flm, fm);
    const right = simpsonRule(m, b, fm, frm, fb);
    const total = left + right;

    if (!Number.isFinite(left) || !Number.isFinite(right) || !Number.isFinite(total)) return NaN;

    // Error estimate based on difference between refined and coarse approximations
    const error = Math.abs(total - whole) / 15;

    if (!Number.isFinite(error)) return NaN;

    if (error < tolerance || depth > maxDepth) {
      // Add error correction term (Richardson extrapolation)
      return total + (total - whole) / 15;
    }

    // Recursively refine both halves with tighter tolerance
    return (
      adaptiveSimpson(a, m, tolerance / 2, fa, flm, fm, left, depth + 1) +
      adaptiveSimpson(m, b, tolerance / 2, fm, frm, fb, right, depth + 1)
    );
  };

  const m = (a + b) / 2;
  const fa = safeEval(a);
  const fm = safeEval(m);
  const fb = safeEval(b);

  if (!Number.isFinite(fa) || !Number.isFinite(fm) || !Number.isFinite(fb)) return NaN;

  const whole = simpsonRule(a, b, fa, fm, fb);

  return adaptiveSimpson(a, b, tolerance, fa, fm, fb, whole, 0);
}
