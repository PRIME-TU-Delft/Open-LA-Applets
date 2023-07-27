import { expect, test } from 'vitest';
import { Sliders } from './Slider';

test('Construct vector 2', () => {
  const s = new Sliders();
  expect(s).toBeTruthy();
});

test('Add simple slider', () => {
  const s = new Sliders();

  s.addSlider(0.5);
  expect(s.sliders.length).toBe(1);
});
