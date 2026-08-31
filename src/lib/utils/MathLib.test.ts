import { describe, it, expect } from 'vitest';
import { integral, referenceIntegral, type ReferenceIntegralResult } from './MathLib';

describe('integral', () => {
  it('should integrate constant functions correctly', () => {
    // ∫5 dx from 0 to 10 = 50
    const result = integral((_x) => 5, 0, 10);
    expect(result).toBeCloseTo(50, 6);
  });

  it('should integrate linear functions correctly', () => {
    // ∫x dx from 0 to 10 = [x²/2] from 0 to 10 = 50
    const result = integral((x) => x, 0, 10);
    expect(result).toBeCloseTo(50, 6);
  });

  it('should integrate quadratic functions correctly', () => {
    // ∫x² dx from 0 to 3 = [x³/3] from 0 to 3 = 9
    const result = integral((x) => x * x, 0, 3);
    expect(result).toBeCloseTo(9, 6);
  });

  it('should integrate polynomial functions correctly', () => {
    // ∫(2x³ + 3x² - x + 1) dx from 0 to 2
    // = [x⁴/2 + x³ - x²/2 + x] from 0 to 2
    // = 8 + 8 - 2 + 2 = 16
    const result = integral((x) => 2 * x ** 3 + 3 * x ** 2 - x + 1, 0, 2);
    expect(result).toBeCloseTo(16, 6);
  });

  it('should integrate trigonometric functions correctly', () => {
    // ∫sin(x) dx from 0 to π = [-cos(x)] from 0 to π = 2
    const result = integral((x) => Math.sin(x), 0, Math.PI);
    expect(result).toBeCloseTo(2, 6);
  });

  it('should integrate cosine correctly', () => {
    // ∫cos(x) dx from 0 to π/2 = [sin(x)] from 0 to π/2 = 1
    const result = integral((x) => Math.cos(x), 0, Math.PI / 2);
    expect(result).toBeCloseTo(1, 6);
  });

  it('should integrate exponential functions correctly', () => {
    // ∫e^x dx from 0 to 1 = [e^x] from 0 to 1 = e - 1 ≈ 1.71828
    const result = integral((x) => Math.E ** x, 0, 1);
    expect(result).toBeCloseTo(Math.E - 1, 6);
  });

  it('should handle negative intervals correctly', () => {
    // ∫x² dx from -2 to 2 = [x³/3] from -2 to 2 = 8/3 - (-8/3) = 16/3
    const result = integral((x) => x * x, -2, 2);
    expect(result).toBeCloseTo(16 / 3, 6);
  });

  it('should handle intervals in reverse order correctly', () => {
    // ∫x dx from 10 to 0 should be -50
    const result = integral((x) => x, 10, 0);
    expect(result).toBeCloseTo(-50, 6);
  });

  it('should integrate rational functions correctly', () => {
    // ∫1/x dx from 1 to e = [ln(x)] from 1 to e = 1
    const result = integral((x) => 1 / x, 1, Math.E);
    expect(result).toBeCloseTo(1, 6);
  });

  it('should handle complex expressions correctly', () => {
    // ∫(sin(x) * x) dx from 0 to π
    const result = integral((x) => x * Math.sin(x), 0, Math.PI);
    expect(result).toBeCloseTo(Math.PI, 5);
  });

  it('should work with custom tolerance', () => {
    // Test with lower tolerance for faster but less accurate result
    const result = integral((x) => x * x, 0, 3, 1e-4);
    expect(result).toBeCloseTo(9, 3);
  });

  it('should handle rapidly varying functions', () => {
    // ∫sin(10x) dx from 0 to π = [-cos(10x)/10] from 0 to π = 0
    const result = integral((x) => Math.sin(10 * x), 0, Math.PI);
    expect(result).toBeCloseTo(0, 5);
  });

  it('should integrate Gaussian function', () => {
    // ∫exp(-x²) dx from -1 to 1
    // This doesn't have a closed form but we can check consistency
    const result = integral((x) => Math.E ** (-x * x), -1, 1);
    expect(result).toBeGreaterThan(1.4);
    expect(result).toBeLessThan(1.5);
  });

  it('should handle zero-width intervals', () => {
    const result = integral((x) => x ** 2, 5, 5);
    expect(result).toBeCloseTo(0, 10);
  });
});

/**
 * A confident result must be numerically correct. Reporting a confident but wrong value is
 * worse than reporting `{ confident: false }`, since the applet displays the value as-is with
 * no further caveat. This only checks the contract; it doesn't require confidence.
 */
function expectCorrectIfConfident(
  result: ReferenceIntegralResult,
  expected: number,
  precision = 3
) {
  if (result.confident) expect(result.value).toBeCloseTo(expected, precision);
}

describe('referenceIntegral', () => {
  it('is not confident for invalid or zero-width bounds', () => {
    expect(referenceIntegral((x) => x, NaN, 1).confident).toBe(false);
    expect(referenceIntegral((x) => x, 0, Infinity).confident).toBe(false);
    expect(referenceIntegral((x) => x, 5, 5).confident).toBe(false);
  });
});

type ClosedFormCase = {
  name: string;
  f: (x: number) => number;
  a: number;
  b: number;
  expected: number;
  precision?: number;
};

/**
 * Smooth, well-behaved integrands with a known closed-form value. There's no excuse for these
 * to decline: they must always be confident and correct.
 */
describe('referenceIntegral: easy closed-form cases are always confident and correct', () => {
  const cases: ClosedFormCase[] = [
    { name: 'constant', f: () => 5, a: 0, b: 10, expected: 50 },
    { name: 'linear', f: (x) => x, a: 0, b: 10, expected: 50 },
    { name: 'linear, reversed bounds', f: (x) => x, a: 10, b: 0, expected: -50 },
    { name: 'quadratic', f: (x) => x * x, a: 0, b: 3, expected: 9 },
    { name: 'quadratic, negative interval', f: (x) => x * x, a: -2, b: 2, expected: 16 / 3 },
    {
      name: 'cubic polynomial',
      f: (x) => 2 * x ** 3 + 3 * x ** 2 - x + 1,
      a: 0,
      b: 2,
      expected: 16
    },
    { name: 'sine, full period', f: Math.sin, a: 0, b: 2 * Math.PI, expected: 0 },
    { name: 'sine, half period', f: Math.sin, a: 0, b: Math.PI, expected: 2 },
    { name: 'cosine, quarter period', f: Math.cos, a: 0, b: Math.PI / 2, expected: 1 },
    { name: 'exponential', f: Math.exp, a: 0, b: 1, expected: Math.E - 1 },
    { name: 'reciprocal, no singularity in range', f: (x) => 1 / x, a: 1, b: Math.E, expected: 1 },
    { name: 'square root', f: Math.sqrt, a: 0, b: 4, expected: 16 / 3 },
    {
      name: 'x sin(x)',
      f: (x) => x * Math.sin(x),
      a: 0,
      b: Math.PI,
      expected: Math.PI,
      precision: 4
    },
    {
      name: 'rational, arctan derivative',
      f: (x) => 1 / (1 + x * x),
      a: -1,
      b: 1,
      expected: Math.PI / 2
    },
    { name: 'large flat interval', f: () => 1, a: 0, b: 1_000_000, expected: 1_000_000 }
  ];

  for (const { name, f, a, b, expected, precision } of cases) {
    it(name, () => {
      const result = referenceIntegral(f, a, b);
      expect(result.confident).toBe(true);
      if (result.confident) expect(result.value).toBeCloseTo(expected, precision ?? 6);
    });
  }
});

/**
 * Integrands where the true value is well-defined but numerically hard to pin down (a bounded
 * singularity, aliasing-prone oscillation). Declining is acceptable here; returning a wrong
 * number is not.
 */
describe('referenceIntegral: hard convergent cases are correct if confident', () => {
  const cases: ClosedFormCase[] = [
    {
      name: 'convergent improper integral, integrable singularity at a boundary',
      f: (x) => 1 / Math.sqrt(x),
      a: 0,
      b: 1,
      expected: 2
    },
    {
      name: 'bounded oscillatory singularity at a boundary (issue #375)',
      f: (x) => Math.sin(1 / x),
      a: 0,
      b: 1,
      expected: 0.5040670747,
      precision: 2
    },
    {
      name: 'bounded oscillatory singularity, odd function on a symmetric interval',
      f: (x) => Math.sin(1 / x),
      a: -1,
      b: 1,
      expected: 0
    },
    {
      name: 'high-frequency oscillation, badly aliased at low resolution',
      f: (x) => Math.sin(1000 * x),
      a: 0,
      b: 2 * Math.PI,
      expected: 0
    }
  ];

  for (const { name, f, a, b, expected, precision } of cases) {
    it(name, () => {
      const result = referenceIntegral(f, a, b);
      expectCorrectIfConfident(result, expected, precision ?? 3);
    });
  }
});

/**
 * Genuinely divergent integrands. There's no correct finite value to report, so the only
 * acceptable outcome is declining.
 */
describe('referenceIntegral: divergent cases always decline', () => {
  const cases: { name: string; f: (x: number) => number; a: number; b: number }[] = [
    { name: 'non-integrable singularity at a boundary', f: (x) => 1 / x, a: 0, b: 1 },
    { name: 'non-integrable singularity, interior', f: (x) => 1 / x, a: -1, b: 1 },
    { name: 'faster blow-up', f: (x) => 1 / (x * x), a: -1, b: 1 },
    {
      name: 'unbounded oscillatory derivative (issue #375)',
      f: (x) => 2 * x * Math.sin(1 / x ** 2) - (2 / x) * Math.cos(1 / x ** 2),
      a: -1,
      b: 1
    },
    { name: 'asymptote crossing the interior', f: Math.tan, a: 0, b: 2 }
  ];

  for (const { name, f, a, b } of cases) {
    it(name, () => {
      const result = referenceIntegral(f, a, b);
      expect(result.confident).toBe(false);
    });
  }
});

/**
 * Cross-checks referenceIntegral against `integral` (adaptive Simpson, already covered by the
 * suite above) for smooth functions without a convenient closed form. If referenceIntegral is
 * confident, it must agree with the independently-computed reference value.
 */
describe('referenceIntegral: matches an independent numeric reference', () => {
  const cases: { name: string; f: (x: number) => number; a: number; b: number }[] = [
    {
      name: 'Gaussian, wide bounds approximating the improper integral',
      f: (x) => Math.exp(-x * x),
      a: -6,
      b: 6
    },
    {
      name: 'sinc, removable singularity away from a grid coincidence',
      f: (x) => (x === 0 ? 1 : Math.sin(x) / x),
      a: -1,
      b: 2
    },
    { name: 'damped oscillation', f: (x) => Math.exp(-x) * Math.cos(5 * x), a: 0, b: 4 },
    { name: 'product of two functions', f: (x) => Math.sqrt(1 + Math.cos(x) ** 2), a: 1.5, b: 4.5 },
    { name: 'steep but smooth', f: (x) => 1 / (1 + 100 * x * x), a: -1, b: 1 }
  ];

  for (const { name, f, a, b } of cases) {
    it(name, () => {
      const reference = integral(f, a, b);
      const result = referenceIntegral(f, a, b);
      expectCorrectIfConfident(result, reference, 3);
    });
  }
});
