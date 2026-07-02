<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Histogram from '$lib/d3/Histogram.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { clamp } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import {
    randomBernoulli,
    randomBinomial,
    randomExponential,
    randomGeometric,
    randomNormal,
    randomPareto,
    randomPoisson,
    randomUniform
  } from 'd3';
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

  const curDistrType: string = $derived(savedDistrType || contDiscControls?.[1]);
  const curCategory: string = $derived(savedCategory || contDiscControls?.[0]);

  const valueFn = (x: number) => x.toFixed(2);
  const valueFnInt = (x: number) => x.toFixed(0);

  let inDistrControls = Controls.addDropdown('Average', ['Average', 'Sum']).addSlider(
    100,
    0,
    300,
    1,
    PrimeColor.blue,
    { label: 'N' }
  );

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
      // Continuous
      case 'Normal':
        return inDistrControls.addSlider(2, 0, 4, 0.1, PrimeColor.raspberry, {
          label: '\\sigma',
          valueFn
        });
      case 'Exponential':
        return inDistrControls.addSlider(1 / 2, 0.1, 3, 0.1, PrimeColor.raspberry, {
          label: '\\lambda',
          valueFn
        });
      case 'Pareto':
        return inDistrControls.addSlider(2, 0, 4, 0.2, PrimeColor.raspberry, {
          label: 'alpha',
          valueFn
        });
      case 'Uniform':
        return inDistrControls; // this just has draggables
      // TODO: add free input
      default: // TO REMOVE
        return undefined;
    }
  });

  const N = $derived.by(() => {
    if (typeof controls?.[1] === 'number') {
      return controls?.[1];
    }

    return 200;
  });

  const draggables = $derived.by(() => {
    switch (savedDistrType) {
      // Continuous
      case 'Normal':
        return [
          new Draggable(new Vector2(0, 0), PrimeColor.orange, '\\mu', (v) => {
            return new Vector2(clamp(v.x, -10, 10), 0);
          })
        ];
      case 'Pareto':
        return [
          new Draggable(new Vector2(1, 0), PrimeColor.blue, 'x_0', (v) => {
            return new Vector2(clamp(v.x, 0, 10), 0);
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
    let expected_value: string | number = 0;
    let variance: string | number = 0;

    let exp_color: PrimeColor = PrimeColor.black;
    let var_color: PrimeColor = PrimeColor.black;

    switch (curDistrType) {
      case 'Normal': {
        const mean_ = draggables?.[0]?.position.x ?? 0;
        const sigma = (controls?.[2] as number) ?? 2;

        expected_value = mean_.toFixed(2);
        variance = Math.pow(sigma, 2).toFixed(2);

        exp_color = PrimeColor.orange;
        var_color = PrimeColor.raspberry;

        break;
      }
      case 'Exponential': {
        const lambda = (controls?.[2] as number) ?? 1;

        expected_value = Math.pow(lambda, -1).toFixed(2);
        variance = Math.pow(lambda, -2).toFixed(2);

        exp_color = var_color = PrimeColor.raspberry;

        break;
      }
      case 'Pareto': {
        const x0 = draggables?.[0]?.position.x ?? 1;
        const alpha = (controls?.[2] as number) ?? 1;

        expected_value = ((alpha * x0) / (alpha - 1)).toFixed(2);
        variance = (alpha * x0 ** 2) / ((alpha - 1) ** 2 * (alpha - 2));

        break;
      }
    }

    return new Formulas(
      new Formula('E[X] &= \\$1').addAutoParam(expected_value, exp_color),
      new Formula('\\text{Var}(X) &= \\$1').addAutoParam(variance, var_color)
    ).align();
  });

  function addFreq(map: { [x: number]: number }, x: number) {
    map[x] = (map[x] ?? 0) + 1;
    return map;
  }

  const randomFn = $derived.by(() => {
    switch (curDistrType) {
      // continuous
      case 'Normal': {
        const mean_ = draggables?.[0]?.position.x ?? 0;
        const sigma = (controls?.[2] as number) ?? 2;

        return randomNormal(mean_, sigma);
      }
      case 'Exponential': {
        const lambda = (controls?.[2] as number) ?? 1;

        return randomExponential(lambda);
      }
      case 'Pareto': {
        const x0 = draggables?.[0]?.position.x ?? 1;
        const alpha = (controls?.[2] as number) ?? 1;

        const d3Pareto = randomPareto(alpha);
        return () => x0 * d3Pareto();
      }
      case 'Uniform': {
        const a = draggables?.[0]?.position.x ?? -5;
        const b = draggables?.[1]?.position.x ?? 5;

        return randomUniform(a, b);
      }
      // discrete
      case 'Bernouli': {
        const p = (controls?.[2] as number) ?? 0.5;

        return randomBernoulli(p);
      }
      case 'Binomial': {
        const p = (controls?.[2] as number) ?? 0.5;
        const n = (controls?.length ?? 0) > 3 ? ((controls?.[3] as number) ?? 10) : 10;

        return randomBinomial(n, p);
      }
      case 'Geometric': {
        const p = (controls?.[2] as number) ?? 0.5;

        return randomGeometric(p);
      }
      case 'Poisson': {
        const gamma = (controls?.[2] as number) ?? 3;

        return randomPoisson(gamma);
      }
      case 'Uniform (die)': {
        const n = (controls?.[2] as number) ?? 6;

        const f = randomUniform(1, n + 1);
        return () => Math.floor(f());
      }
      default: {
        return () => 0;
      }
    }
  });

  const freqMap = $derived.by(() => {
    let m: Record<number, number> = {};

    for (let i = 0; i < N; i++) {
      const res = Math.floor(randomFn() ?? 0);
      m = addFreq(m, res);
    }

    return m;
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
  initialViewBox={new ViewBox(new Vector2(-10, 0), new Vector2(10, 10), 0.5)}
>
  <Histogram
    {freqMap}
    isInteger={curCategory === 'Discrete'}
    color={PrimeColor.cyan}
    normalizedHeight={10}
  />
</Canvas2D>
