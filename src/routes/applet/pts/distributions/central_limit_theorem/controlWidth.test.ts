import { describe, it, expect } from 'vitest';
import { Controls, type Controller } from '$lib/controls/Controls';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { DISTRIBUTIONS } from '../distributionRegistry';

const NSC = 'applets.pts.distributions.central_limit_theorem.';

describe('CLT applet control chain fits the width budget', () => {
  for (const [name, def] of Object.entries(DISTRIBUTIONS)) {
    it(`does not throw for ${name} (${def.sliders.length} slider(s))`, () => {
      expect(() => {
        let controls: Controls<unknown, readonly Controller<unknown>[]> = Controls.addButton(
          'Draw',
          PrimeColor.pink,
          () => {}
        )
          .addDropdown(`${NSC}average`, [`${NSC}average`, `${NSC}sum`])
          .addSlider(5, 1, 50, 1, PrimeColor.blue, { label: 'k' });

        for (const s of def.sliders) {
          controls = controls.addSlider(s.default, s.from, s.to, s.step, s.color, {
            label: s.label
          });
        }
      }).not.toThrow();
    });
  }
});
