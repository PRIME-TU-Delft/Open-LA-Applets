export const MAX_SAMPLES = 300;

/**
 * How many new samples the next "Draw" click should add, given the number of
 * samples already accumulated. Batch size escalates as the count grows, and
 * is clamped so the total never exceeds MAX_SAMPLES.
 */
export function nextBatchSize(currentCount: number): number {
  if (currentCount >= MAX_SAMPLES) return 0;

  const step = currentCount < 5 ? 1 : currentCount < 25 ? 5 : currentCount < 100 ? 10 : 25;

  return Math.min(step, MAX_SAMPLES - currentCount);
}
