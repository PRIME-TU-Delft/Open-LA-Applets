<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { clamp } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  // TODO: create translations

  const baseControls = Controls.addDropdown('Continuous', ['Continuous', 'Discrete']);

  const discrete = $derived(baseControls[0] === 'Discrete');

  const contDiscControls = $derived.by(() => {
    if (discrete) {
      return baseControls.addDropdown('Bernouli', [
        'Bernouli',
        'Binomial',
        'Geometric',
        'Poisson',
        'Uniform (die)',
        'Free input'
      ]);
    } else {
      return baseControls.addDropdown('Normal', [
        'Normal',
        'Exponential',
        'Pareto',
        'Uniform',
        'Free input'
      ]);
    }
  });

  const distrType = $derived(contDiscControls[1]);

  const valueFn = (x: number) => x.toFixed(2);
  const valueFnInt = (x: number) => x.toFixed(0);

  const controls = $derived.by(() => {
    switch (distrType) {
      // discrete
      case 'Bernouli':
        return contDiscControls.addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
          label: 'p',
          valueFn
        });
      case 'Binomial':
        return contDiscControls
          .addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
            label: 'p',
            valueFn
          })
          .addSlider(10, 2, 20, 1, PrimeColor.blue, {
            label: 'n',
            valueFn: valueFnInt
          });
      case 'Geometric':
        return contDiscControls.addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
          label: 'p',
          valueFn
        });
      case 'Poisson':
        return contDiscControls.addSlider(3, 0, 10, 0.5, PrimeColor.raspberry, {
          label: 'gamma',
          valueFn
        });
      case 'Uniform (die)':
        return contDiscControls.addSlider(10, 2, 20, 1, PrimeColor.blue, {
          label: 'n',
          valueFn: valueFnInt
        });
      // continous
      case 'Normal':
        return contDiscControls.addSlider(2, 0, 4, 0.1, PrimeColor.raspberry, {
          label: 'sigma',
          valueFn
        });
      case 'Exponential':
        return contDiscControls.addSlider(4, 0, 10, 0.5, PrimeColor.raspberry, {
          label: 'lambda',
          valueFn
        });
      case 'Pareto':
        return contDiscControls
          .addSlider(4, 0, 10, 0.5, PrimeColor.blue, {
            label: 'x_0',
            valueFn
          })
          .addSlider(2, 0, 4, 0.2, PrimeColor.raspberry, {
            label: 'alpha',
            valueFn
          });
      case 'Uniform':
        return contDiscControls; // this just has draggables
      // TODO: add free input
      default: // TO REMOVE
        return contDiscControls;
    }
  });

  const draggables = $derived.by(() => {
    switch (distrType) {
      // continous
      case 'Normal':
        return [
          new Draggable(new Vector2(0, 0), PrimeColor.blue, '\\mu', (v) => {
            return new Vector2(clamp(v.x, -10, 10), 0);
          })
        ];
      case 'Uniform': {
        const a = new Draggable(new Vector2(-5, 0), PrimeColor.raspberry, 'a');
        const b = new Draggable(new Vector2(5, 0), PrimeColor.blue, 'b', (v) => {
          return new Vector2(clamp(v.x, Math.max(-10, a.value.x), 10), 0);
        });

        a.snapFn = (v) => {
          return new Vector2(clamp(v.x, -10, Math.min(10, b.value.x)), 0);
        };
        return [a, b];
      }
      default:
        return [];
    }
  });

  const formulas = $derived.by(() => {
    const expected_value = 0; // TODO
    const variance = 0; // TOOD

    return new Formulas(
      new Formula('E[X] &= \\$1').addAutoParam(expected_value),
      new Formula('\\text{Var}(X) &= \\$1').addAutoParam(variance)
    ).align();
  });
</script>

<Canvas2D {controls} {draggables} {formulas}>
  <Vector2D />
</Canvas2D>
