import { describe, it, expect } from 'vitest';
import { buildSeededRandomInjectionScript } from './generate-screenshots';

describe('buildSeededRandomInjectionScript', () => {
  it('produces a script that overrides Math.random deterministically', () => {
    const script = buildSeededRandomInjectionScript(42);
    expect(script).toContain('Math.random');

    // Simulate what the browser would do with this script
    const fn = new Function(`${script}; return [Math.random(), Math.random(), Math.random()];`);
    const first = fn();
    const fn2 = new Function(`${script}; return [Math.random(), Math.random(), Math.random()];`);
    const second = fn2();

    expect(first).toEqual(second);
    first.forEach((n: number) => {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    });
  });

  it('produces different sequences for different seeds', () => {
    const scriptA = buildSeededRandomInjectionScript(1);
    const scriptB = buildSeededRandomInjectionScript(2);
    const a = new Function(`${scriptA}; return Math.random();`)();
    const b = new Function(`${scriptB}; return Math.random();`)();
    expect(a).not.toBe(b);
  });
});
