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

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

/**
 * Finds the minimum and maximum of a function on an interval by simple sampling (no derivatives)
 * @param f - function to evaluate
 * @param a - lower bound of the interval
 * @param b - upper bound of the interval
 * @param samples - number of sample points, defaults to 1000
 * @returns object with the minimum and maximum values found
 */
export function findMinMax(
  f: (x: number) => number,
  a: number,
  b: number,
  samples: number = 1000
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i <= samples; i++) {
    const x = a + (i / samples) * (b - a);
    const y = f(x);
    if (y < min) min = y;
    if (y > max) max = y;
  }

  return { min, max };
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

export type ReferenceIntegralResult = { confident: true; value: number } | { confident: false };

/**
 * Relative difference between two differently-resolved passes, below which they're
 * considered to agree. See `referenceIntegral`.
 */
const INTEGRAL_CONFIDENCE_RELATIVE_ERROR = 1e-3;

type QuadratureResult = { value: number; diverged: boolean };

/**
 * Midpoint Riemann sum over `n` equal-width cells. Every sample sits strictly inside its cell,
 * never on a shared boundary or a rational point like an interval's exact midpoint, so an
 * isolated singularity (e.g. sin(1/x) at x = 0) is skipped rather than substituted for.
 */
function riemannMidpointSum(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number
): QuadratureResult {
  const blowupThreshold = 1e12;
  const width = (b - a) / n;
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const x = a + (i + 0.5) * width;
    const v = f(x);
    if (!Number.isFinite(v) || Math.abs(v) > blowupThreshold) return { value: NaN, diverged: true };
    sum += v;
  }

  return { value: sum * width, diverged: false };
}

/**
 * Computes a definite integral's reference value using pure numeric quadrature, with a
 * confidence flag instead of a bare NaN-as-divergence signal. Cross-checks two independently
 * resolved midpoint Riemann sums and only reports a value when they agree. A hard-to-resolve
 * integrand (e.g. a bounded but rapidly oscillating one) yields `{ confident: false }` instead
 * of a false claim of divergence or a wrong finite value. See issue #375.
 * @param f - Integrand, as a plain numeric function
 * @param xL - Lower bound of integration
 * @param xR - Upper bound of integration
 */
export function referenceIntegral(
  f: (x: number) => number,
  xL: number,
  xR: number
): ReferenceIntegralResult {
  if (!Number.isFinite(xL) || !Number.isFinite(xR) || xL === xR) return { confident: false };

  // Cell counts are coprime-ish (not a common multiple of one another) so the two grids never
  // share a sample point, which would let a shared bad sample make them agree spuriously.
  const coarse = riemannMidpointSum(f, xL, xR, 2003);
  const fine = riemannMidpointSum(f, xL, xR, 8009);

  if (coarse.diverged || fine.diverged) return { confident: false };
  if (!Number.isFinite(coarse.value) || !Number.isFinite(fine.value)) return { confident: false };

  const scale = Math.max(Math.abs(coarse.value), Math.abs(fine.value), 1e-9);
  const relativeDifference = Math.abs(coarse.value - fine.value) / scale;

  if (relativeDifference > INTEGRAL_CONFIDENCE_RELATIVE_ERROR) return { confident: false };

  return { confident: true, value: fine.value };
}

/**
 * Projects a point onto the nearest point on an implicit curve defined by zeroFunc(x, y) = 0.
 * Uses alternating Newton projection (onto the constraint) and tangent-direction minimisation steps.
 * @param zeroFunc - Implicit function; the curve is the zero set f(x, y) = 0
 * @param startPoint - The point to project
 * @param maxIterations - Maximum number of iterations (default: 1000)
 * @param tolerance - Convergence tolerance for the KKT residual (default: 1e-6)
 * @returns The closest point on the implicit curve to startPoint
 */
export function projectToImplicitFunction2D(
  zeroFunc: (x: number, y: number) => number,
  startPoint: Vector2,
  maxIterations: number = 1000,
  tolerance: number = 1e-6
): Vector2 {
  const h = 1e-5;

  const gradient = (x: number, y: number): [number, number] => [
    (zeroFunc(x + h, y) - zeroFunc(x - h, y)) / (2 * h),
    (zeroFunc(x, y + h) - zeroFunc(x, y - h)) / (2 * h)
  ];

  let qx = startPoint.x;
  let qy = startPoint.y;

  for (let i = 0; i < maxIterations; i++) {
    // Step 1: Newton step to project q onto the curve f(q) = 0
    const [gx, gy] = gradient(qx, qy);
    const gradNorm2 = gx * gx + gy * gy;
    if (gradNorm2 < 1e-20) break;

    const fVal = zeroFunc(qx, qy);
    qx -= (fVal * gx) / gradNorm2;
    qy -= (fVal * gy) / gradNorm2;

    // Step 2: Check KKT condition — (q - p) should be parallel to ∇f at the minimum
    const [gx2, gy2] = gradient(qx, qy);
    const gradNorm2_2 = gx2 * gx2 + gy2 * gy2;
    if (gradNorm2_2 < 1e-20) break;

    const dx = qx - startPoint.x;
    const dy = qy - startPoint.y;

    // Tangential component of (q - startPoint): diff minus its projection onto ∇f
    const dotProd = (dx * gx2 + dy * gy2) / gradNorm2_2;
    const tangX = dx - dotProd * gx2;
    const tangY = dy - dotProd * gy2;

    if (Math.sqrt(tangX * tangX + tangY * tangY) < tolerance) break;

    // Move q in the negative tangential direction to reduce distance to startPoint
    qx -= tangX;
    qy -= tangY;
  }

  return new Vector2(qx, qy);
}

/**
 * Projects a point onto the nearest point on a parametrized curve (xFunc(t), yFunc(t)).
 * Uses a coarse grid search to find a good initial parameter, then refines with Newton's
 * method on D'(t) = 0 where D(t) = ½‖(x(t),y(t)) − startPoint‖².
 * @param xFunc - x component of the parametric curve
 * @param yFunc - y component of the parametric curve
 * @param startPoint - The point to project
 * @param tStart - Start of the parameter domain
 * @param tEnd - End of the parameter domain
 * @param maxIterations - Maximum Newton iterations (default: 1000)
 * @param tolerance - Convergence tolerance on D'(t) (default: 1e-6)
 * @returns The closest point on the parametrized curve to startPoint
 */
export function projectToParametrizedFunction2D(
  xFunc: (t: number) => number,
  yFunc: (t: number) => number,
  startPoint: Vector2,
  tStart: number,
  tEnd: number,
  maxIterations: number = 1000,
  tolerance: number = 1e-6
): [Vector2, number] {
  const h = 1e-5;

  const xPrime = (t: number) => (xFunc(t + h) - xFunc(t - h)) / (2 * h);
  const yPrime = (t: number) => (yFunc(t + h) - yFunc(t - h)) / (2 * h);
  const xDoublePrime = (t: number) => (xFunc(t + h) - 2 * xFunc(t) + xFunc(t - h)) / (h * h);
  const yDoublePrime = (t: number) => (yFunc(t + h) - 2 * yFunc(t) + yFunc(t - h)) / (h * h);

  // Coarse grid search for a good initial t
  const numSamples = 100;
  let bestT = tStart;
  let bestDist2 = Infinity;
  for (let i = 0; i <= numSamples; i++) {
    const t = tStart + (i / numSamples) * (tEnd - tStart);
    const dx = xFunc(t) - startPoint.x;
    const dy = yFunc(t) - startPoint.y;
    const dist2 = dx * dx + dy * dy;
    if (dist2 < bestDist2) {
      bestDist2 = dist2;
      bestT = t;
    }
  }

  // Newton's method: find t* minimising D(t) = ½‖curve(t) − p‖²
  // D'(t)  = (x−px)·x' + (y−py)·y'
  // D''(t) = x'² + (x−px)·x'' + y'² + (y−py)·y''
  let t = bestT;
  for (let i = 0; i < maxIterations; i++) {
    const x = xFunc(t);
    const y = yFunc(t);
    const xp = xPrime(t);
    const yp = yPrime(t);

    const dPrime = (x - startPoint.x) * xp + (y - startPoint.y) * yp;
    if (Math.abs(dPrime) < tolerance) break;

    const dDoublePrime =
      xp * xp +
      (x - startPoint.x) * xDoublePrime(t) +
      yp * yp +
      (y - startPoint.y) * yDoublePrime(t);

    if (Math.abs(dDoublePrime) < 1e-20) break;

    t = Math.max(tStart, Math.min(tEnd, t - dPrime / dDoublePrime));
  }

  return [new Vector2(xFunc(t), yFunc(t)), t];
}

/** Dormand-Prince RK45 Butcher tableau (c nodes, a coefficients, 5th/4th order weights) */
const DP45_C = [0, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
const DP45_A = [
  [],
  [1 / 5],
  [3 / 40, 9 / 40],
  [44 / 45, -56 / 15, 32 / 9],
  [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
  [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
  [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]
];
const DP45_B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];
const DP45_B4 = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40];

/** Takes a single Dormand-Prince RK45 step, returning the 5th order update and the embedded error estimate */
function dormandPrinceStep(f: (t: number, y: number) => number, t: number, y: number, h: number) {
  const k: number[] = [f(t, y)];
  for (let i = 1; i < 7; i++) {
    let ySum = y;
    for (let j = 0; j < i; j++) ySum += h * DP45_A[i][j] * k[j];
    k.push(f(t + DP45_C[i] * h, ySum));
  }

  let y5 = y;
  let y4 = y;
  for (let i = 0; i < 7; i++) {
    y5 += h * DP45_B5[i] * k[i];
    y4 += h * DP45_B4[i] * k[i];
  }

  return { y5, error: y5 - y4 };
}

/** Settings controlling the accuracy and step-size behaviour of {@link solveInitialValueProblem} */
export interface IVPAccuracyOptions {
  /** Relative error tolerance used for adaptive step-size control (default: 1e-6) */
  tolerance?: number;
  /** Absolute error tolerance used for adaptive step-size control (default: 1e-9) */
  absoluteTolerance?: number;
  /** Initial step size to try (default: length of the sub-range being integrated / 100) */
  initialStep?: number;
  /** Smallest step size allowed before giving up (default: 1e-12) */
  minStep?: number;
  /** Largest step size allowed (default: length of the sub-range being integrated) */
  maxStep?: number;
  /** Safety limit on the number of accepted steps per integration direction (default: 10000) */
  maxSteps?: number;
}

interface SolutionNode {
  t: number;
  y: number;
  dy: number;
}

/** Evaluates the cubic Hermite segment between two nodes at normalized position s in [0, 1] */
function hermiteEval(p0: SolutionNode, p1: SolutionNode, s: number): number {
  const h = p1.t - p0.t;
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1;
  const h10 = s ** 3 - 2 * s ** 2 + s;
  const h01 = -2 * s ** 3 + 3 * s ** 2;
  const h11 = s ** 3 - s ** 2;
  return h00 * p0.y + h10 * h * p0.dy + h01 * p1.y + h11 * h * p1.dy;
}

/** Bisects the Hermite segment between two nodes to find where it crosses the given y boundary, assuming p0 is within range and p1 is not */
function findBoundaryCrossing(p0: SolutionNode, p1: SolutionNode, boundary: number): number {
  let sLo = 0;
  let sHi = 1;
  let fLo = hermiteEval(p0, p1, sLo) - boundary;
  const fHi = hermiteEval(p0, p1, sHi) - boundary;
  if (fLo === 0) return sLo;
  if (fHi === 0 || Math.sign(fLo) === Math.sign(fHi)) return sHi;

  for (let i = 0; i < 60; i++) {
    const sMid = (sLo + sHi) / 2;
    const fMid = hermiteEval(p0, p1, sMid) - boundary;
    if (fMid === 0) return sMid;
    if (Math.sign(fMid) === Math.sign(fLo)) {
      sLo = sMid;
      fLo = fMid;
    } else {
      sHi = sMid;
    }
  }
  return (sLo + sHi) / 2;
}

/** Result of integrating in one direction: the accepted solution nodes, and whether the sweep stopped early because y left [yMin, yMax] (as opposed to reaching tEnd) */
interface DirectionResult {
  nodes: SolutionNode[];
  exitedYRange: boolean;
}

/** Integrates from t0 towards tEnd with adaptive Dormand-Prince RK45, returning the accepted solution nodes in the direction of travel. Stops as soon as y leaves [yMin, yMax], adding an accurate boundary-crossing node as the last one. */
function integrateDirection(
  f: (t: number, y: number) => number,
  t0: number,
  y0: number,
  tEnd: number,
  yMin: number,
  yMax: number,
  options: Required<IVPAccuracyOptions>
): DirectionResult {
  const direction = Math.sign(tEnd - t0);
  const nodes: SolutionNode[] = [{ t: t0, y: y0, dy: f(t0, y0) }];
  if (direction === 0) return { nodes, exitedYRange: false };

  const maxStep = Math.min(options.maxStep, Math.abs(tEnd - t0));
  let t = t0;
  let y = y0;
  let h = direction * Math.min(options.initialStep, maxStep);
  let steps = 0;

  while (direction > 0 ? t < tEnd : t > tEnd) {
    if (steps++ > options.maxSteps) {
      throw new Error('solveInitialValueProblem: exceeded the maximum number of steps');
    }
    if (direction > 0 ? t + h > tEnd : t + h < tEnd) h = tEnd - t;

    const { y5, error } = dormandPrinceStep(f, t, y, h);
    if (!Number.isFinite(y5)) {
      throw new Error(`solveInitialValueProblem: solution diverged near t=${t}`);
    }

    const scale =
      options.absoluteTolerance + options.tolerance * Math.max(Math.abs(y), Math.abs(y5));
    const errNorm = Math.abs(error) / scale;
    // standard RK45 step-size controller: shrink/grow h based on the ratio of tolerance to estimated error
    const factor = Math.min(5, Math.max(0.2, 0.9 * Math.pow(Math.max(errNorm, 1e-12), -0.2)));

    if (errNorm <= 1) {
      const tNew = t + h;
      if (y5 < yMin || y5 > yMax) {
        const boundary = y5 > yMax ? yMax : yMin;
        const prevNode = nodes[nodes.length - 1];
        const candidate: SolutionNode = { t: tNew, y: y5, dy: f(tNew, y5) };
        const s = findBoundaryCrossing(prevNode, candidate, boundary);
        const tBoundary = prevNode.t + s * (candidate.t - prevNode.t);
        nodes.push({ t: tBoundary, y: boundary, dy: f(tBoundary, boundary) });
        return { nodes, exitedYRange: true };
      }

      t = tNew;
      y = y5;
      nodes.push({ t, y, dy: f(t, y) });
      h = direction * Math.min(maxStep, Math.abs(h) * factor);
    } else {
      const shrunk = Math.abs(h) * factor;
      if (shrunk <= options.minStep) {
        throw new Error(
          `solveInitialValueProblem: step size underflow while meeting accuracy at t=${t}`
        );
      }
      h = direction * Math.max(options.minStep, shrunk);
    }
  }

  return { nodes, exitedYRange: false };
}

/** Builds a C1-continuous cubic Hermite interpolant through solution nodes, using the known derivative f(t,y) at each node */
function buildHermiteInterpolant(nodes: SolutionNode[]): (t: number) => number {
  const first = nodes[0];
  const last = nodes[nodes.length - 1];

  return function solution(t: number): number {
    if (t <= first.t) return first.y + (t - first.t) * first.dy;
    if (t >= last.t) return last.y + (t - last.t) * last.dy;

    let lo = 0;
    let hi = nodes.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (nodes[mid].t <= t) lo = mid;
      else hi = mid;
    }

    return hermiteEval(nodes[lo], nodes[hi], (t - nodes[lo].t) / (nodes[hi].t - nodes[lo].t));
  };
}

/**
 * Numerically solves the initial value problem y' = f(t, y), y(t0) = y0 with an adaptive
 * Dormand-Prince RK45 method, then returns a continuous function that best resembles the exact
 * solution by cubic-Hermite-interpolating the numerical solution (matching value and derivative
 * at every accepted step). If t0 lies strictly inside tRange, the ODE is integrated both forward
 * and backward from t0 so the returned function covers the whole range. Each sweep stops as soon
 * as the solution would leave yRange. The returned function is NaN beyond the point where a sweep
 * left yRange, so plotting it stops there instead of continuing flat along the boundary.
 * @param f - Right-hand side of the ODE, f(t, y)
 * @param t0 - Initial time
 * @param y0 - Initial value, y(t0); must lie within yRange
 * @param tRange - [start, end] of the time range the solution must cover; must contain t0
 * @param yRange - [min, max] bound the solution is not allowed to leave; each sweep stops at the first crossing
 * @param options - Optional accuracy and step-size settings
 * @returns The solution function (returning NaN once t is past where the solution left yRange), and the
 * sub-range of tRange it actually covers (narrowed from tRange if a sweep left yRange before reaching an end)
 */
export function solveInitialValueProblem(
  f: (t: number, y: number) => number,
  t0: number,
  y0: number,
  tRange: [number, number],
  yRange: [number, number],
  options: IVPAccuracyOptions = {}
): { solution: (t: number) => number; tRange: [number, number] } {
  const [tMin, tMax] = tRange[0] <= tRange[1] ? tRange : [tRange[1], tRange[0]];
  if (t0 < tMin || t0 > tMax) {
    throw new Error('solveInitialValueProblem: t0 must lie within tRange');
  }

  const [yMin, yMax] = yRange[0] <= yRange[1] ? yRange : [yRange[1], yRange[0]];
  if (y0 < yMin || y0 > yMax) {
    throw new Error('solveInitialValueProblem: y0 must lie within yRange');
  }

  const resolvedOptions: Required<IVPAccuracyOptions> = {
    tolerance: options.tolerance ?? 1e-6,
    absoluteTolerance: options.absoluteTolerance ?? 1e-9,
    initialStep: options.initialStep ?? ((tMax - tMin) / 100 || 1e-3),
    minStep: options.minStep ?? 1e-12,
    maxStep: options.maxStep ?? (tMax - tMin || 1e-3),
    maxSteps: options.maxSteps ?? 10000
  };

  const forwardResult: DirectionResult =
    t0 < tMax
      ? integrateDirection(f, t0, y0, tMax, yMin, yMax, resolvedOptions)
      : { nodes: [{ t: t0, y: y0, dy: f(t0, y0) }], exitedYRange: false };
  const backwardResult: DirectionResult =
    t0 > tMin
      ? integrateDirection(f, t0, y0, tMin, yMin, yMax, resolvedOptions)
      : { nodes: [], exitedYRange: false };
  const backwardNodes = [...backwardResult.nodes].reverse();

  const nodes = [...backwardNodes.slice(0, -1), ...forwardResult.nodes];
  const rawSolution = buildHermiteInterpolant(nodes);
  const first = nodes[0];
  const last = nodes[nodes.length - 1];

  const solution = (t: number) => {
    // stop reporting values once t is past the point where a sweep left yRange, instead of extrapolating along the boundary
    if (t < first.t && backwardResult.exitedYRange) return NaN;
    if (t > last.t && forwardResult.exitedYRange) return NaN;
    // clamp so any remaining interpolation overshoot can never leave yRange
    return Math.min(yMax, Math.max(yMin, rawSolution(t)));
  };

  return { solution, tRange: [first.t, last.t] };
}
