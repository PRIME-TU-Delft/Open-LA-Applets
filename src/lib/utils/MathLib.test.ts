import { describe, it, expect } from 'vitest';
import { integral } from './MathLib';

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
