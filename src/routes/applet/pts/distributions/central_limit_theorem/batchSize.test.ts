import { describe, it, expect } from 'vitest';
import { nextBatchSize, MAX_SAMPLES } from './batchSize';

describe('nextBatchSize', () => {
  it('escalates through +1, +5, +10, +25 as the count grows', () => {
    expect(nextBatchSize(0)).toBe(1);
    expect(nextBatchSize(4)).toBe(1);
    expect(nextBatchSize(5)).toBe(5);
    expect(nextBatchSize(24)).toBe(5);
    expect(nextBatchSize(25)).toBe(10);
    expect(nextBatchSize(99)).toBe(10);
    expect(nextBatchSize(100)).toBe(25);
  });

  it('clamps the final batch so the total lands exactly on MAX_SAMPLES', () => {
    expect(nextBatchSize(MAX_SAMPLES - 10)).toBe(10);
    expect(nextBatchSize(MAX_SAMPLES - 1)).toBe(1);
  });

  it('returns 0 once the cap is reached', () => {
    expect(nextBatchSize(MAX_SAMPLES)).toBe(0);
    expect(nextBatchSize(MAX_SAMPLES + 5)).toBe(0);
  });
});
