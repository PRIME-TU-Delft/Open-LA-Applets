<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Histogram from '$lib/d3/Histogram.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { clamp } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  // TODO: create translations

  const baseControls = Controls.addDropdown('Continuous', ['Continuous', 'Discrete']);

  const discrete = $derived(baseControls[0] === 'Discrete');

  let savedCategory: string = $state('');
  let savedDistrType: string = $state('');

  const contDiscControls = $derived.by(() => {
    let cont;

    if (discrete) {
      cont = baseControls.addDropdown('Bernouli', [
        'Bernouli',
        'Binomial',
        'Geometric',
        'Poisson',
        'Uniform (die)',
        'Free input'
      ]);
    } else {
      cont = baseControls.addDropdown('Normal', [
        'Normal',
        'Exponential',
        'Pareto',
        'Uniform',
        'Free input'
      ]);
    }

    return cont.addButton('Next', PrimeColor.raspberry, () => {
      savedCategory = cont[0];
      savedDistrType = cont[1];
    });
  });

  const valueFn = (x: number) => x.toFixed(2);
  const valueFnInt = (x: number) => x.toFixed(0);

  let inDistrControls = Controls.addButton('Back', PrimeColor.raspberry, () => {
    savedCategory = '';
    savedDistrType = '';
  })
    .addDropdown('Average', ['Average', 'Sum'])
    .addSlider(100, 0, 300, 1, PrimeColor.blue, { label: 'N' });

  const controls = $derived.by(() => {
    if (!savedCategory || !savedDistrType) {
      return contDiscControls;
    }

    switch (savedDistrType) {
      // discrete
      case 'Bernouli':
        return inDistrControls.addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
          label: 'p',
          valueFn
        });
      case 'Binomial':
        return inDistrControls
          .addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
            label: 'p',
            valueFn
          })
          .addSlider(10, 2, 20, 1, PrimeColor.blue, {
            label: 'n',
            valueFn: valueFnInt
          });
      case 'Geometric':
        return inDistrControls.addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
          label: 'p',
          valueFn
        });
      case 'Poisson':
        return inDistrControls.addSlider(3, 0, 10, 0.5, PrimeColor.raspberry, {
          label: 'gamma',
          valueFn
        });
      case 'Uniform (die)':
        return inDistrControls.addSlider(10, 2, 20, 1, PrimeColor.blue, {
          label: 'n',
          valueFn: valueFnInt
        });
      // continous
      case 'Normal':
        return inDistrControls.addSlider(2, 0, 4, 0.1, PrimeColor.raspberry, {
          label: 'sigma',
          valueFn
        });
      case 'Exponential':
        return inDistrControls.addSlider(4, 0, 10, 0.5, PrimeColor.raspberry, {
          label: 'lambda',
          valueFn
        });
      case 'Pareto':
        return inDistrControls
          .addSlider(4, 0, 10, 0.5, PrimeColor.blue, {
            label: 'x_0',
            valueFn
          })
          .addSlider(2, 0, 4, 0.2, PrimeColor.raspberry, {
            label: 'alpha',
            valueFn
          });
      case 'Uniform':
        return undefined; // this just has draggables
      // TODO: add free input
      default: // TO REMOVE
        return undefined;
    }
  });

  const draggables = $derived.by(() => {
    switch (savedDistrType) {
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

<Canvas2D
  {controls}
  {draggables}
  {formulas}
  onReset={() => {
    savedCategory = '';
    savedDistrType = '';
  }}
>
  {#if savedCategory == 'Continous' && savedDistrType == 'Normal'}
    <Histogram />
  {:else}
    <Latex2D latex="empty" />
  {/if}
</Canvas2D>
