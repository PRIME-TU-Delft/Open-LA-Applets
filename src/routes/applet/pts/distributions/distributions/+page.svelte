<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Histogram from '$lib/d3/Histogram2D.svelte';
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
  import { _ } from 'svelte-i18n';
  import { Vector2 } from 'three';

  const NS = 'applets.pts.distributions.distributions.';

  const baseControls = Controls.addDropdown(`${NS}continuous`, [
    `${NS}continuous`,
    `${NS}discrete`
  ]);

  const discrete = $derived(baseControls[0] === `${NS}discrete`);

  let savedCategory: string = $state('');
  let savedDistrType: string = $state('');

  const contDiscControls = $derived.by(() => {
    let cont;

    if (discrete) {
      cont = baseControls.addDropdown(`${NS}bernouli`, [
        `${NS}bernouli`,
        `${NS}binomial`,
        `${NS}geometric`,
        `${NS}poisson`,
        `${NS}uniform_die`
      ]);
    } else {
      cont = baseControls.addDropdown(`${NS}normal`, [
        `${NS}normal`,
        `${NS}exponential`,
        `${NS}pareto`,
        `${NS}uniform`
      ]);
    }

    return cont.addButton($_(`${NS}next`), PrimeColor.raspberry, () => {
      savedCategory = cont[0];
      savedDistrType = cont[1];
    });
  });

  const curDistrType: string = $derived(savedDistrType || contDiscControls?.[1]);
  const curCategory: string = $derived(savedCategory || contDiscControls?.[0]);

  const valueFn = (x: number) => x.toFixed(2);
  const valueFnInt = (x: number) => x.toFixed(0);

  let inDistrControls = Controls.addDropdown(`${NS}average`, [
    `${NS}average`,
    `${NS}sum`
  ]).addSlider(
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

    switch (savedDistrType?.replace(NS, '')) {
      // discrete
      case 'bernouli':
        return inDistrControls.addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
          label: 'p',
          valueFn
        });
      case 'binomial':
        return inDistrControls
          .addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
            label: 'p',
            valueFn
          })
          .addSlider(10, 2, 20, 1, PrimeColor.blue, {
            label: 'n',
            valueFn: valueFnInt
          });
      case 'geometric':
        return inDistrControls.addSlider(0.5, 0, 1, 0.05, PrimeColor.raspberry, {
          label: 'p',
          valueFn
        });
      case 'poisson':
        return inDistrControls.addSlider(3, 0, 10, 0.5, PrimeColor.raspberry, {
          label: '\\lambda',
          valueFn
        });
      case 'uniform_die':
        return inDistrControls.addSlider(10, 2, 20, 1, PrimeColor.blue, {
          label: 'n',
          valueFn: valueFnInt
        });
      // Continuous
      case 'normal':
        return inDistrControls.addSlider(2, 0, 4, 0.1, PrimeColor.raspberry, {
          label: '\\sigma',
          valueFn
        });
      case 'exponential':
        return inDistrControls.addSlider(1 / 2, 0.1, 3, 0.1, PrimeColor.raspberry, {
          label: '\\lambda',
          valueFn
        });
      case 'pareto':
        return inDistrControls.addSlider(2, 0, 4, 0.2, PrimeColor.raspberry, {
          label: '\\alpha',
          valueFn
        });
      case 'uniform':
        return inDistrControls; // this just has draggables
      default:
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
    switch (savedDistrType?.replace(NS, '')) {
      // Continuous
      case 'normal':
        return [
          new Draggable(new Vector2(4, 0), PrimeColor.orange, '\\mu', (v) => {
            return new Vector2(clamp(v.x, -10, 10), 0);
          })
        ];
      case 'pareto':
        return [
          new Draggable(new Vector2(1, 0), PrimeColor.blue, 'x_0', (v) => {
            return new Vector2(clamp(v.x, 0, 10), 0);
          })
        ];
      case 'uniform': {
        const a = new Draggable(new Vector2(-2, 0), PrimeColor.raspberry, 'a');
        const b = new Draggable(new Vector2(8, 0), PrimeColor.blue, 'b', (v) => {
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

    switch (curDistrType?.replace(NS, '')) {
      case 'normal': {
        const mean_ = draggables?.[0]?.position.x ?? 4;
        const sigma = (controls?.[2] as number) ?? 2;

        expected_value = mean_.toFixed(2);
        variance = Math.pow(sigma, 2).toFixed(2);

        exp_color = PrimeColor.orange;
        var_color = PrimeColor.raspberry;

        break;
      }
      case 'exponential': {
        const lambda = (controls?.[2] as number) ?? 1;

        expected_value = Math.pow(lambda, -1).toFixed(2);
        variance = Math.pow(lambda, -2).toFixed(2);

        exp_color = var_color = PrimeColor.raspberry;

        break;
      }
      case 'pareto': {
        const x0 = draggables?.[0]?.position.x ?? 1;
        const alpha = (controls?.[2] as number) ?? 2;

        expected_value = ((alpha * x0) / (alpha - 1)).toFixed(2);
        variance = ((alpha * x0 ** 2) / ((alpha - 1) ** 2 * (alpha - 2))).toFixed(2);

        if (alpha <= 1) {
          expected_value = '\\infty';
        }
        if (alpha <= 2) {
          variance = '\\infty';
        }
        if (alpha <= 1) {
          variance = 'DNE';
        }

        break;
      }
      case 'uniform': {
        const a = draggables?.[0]?.position.x ?? -2;
        const b = draggables?.[1]?.position.x ?? 8;

        expected_value = ((a + b) / 2).toFixed(2);
        variance = (Math.pow(b - a, 2) / 12).toFixed(2);

        break;
      }
      // discrete
      case 'bernouli': {
        const p = (controls?.[2] as number) ?? 0.5;
        expected_value = p.toFixed(2);
        variance = (p * (1 - p)).toFixed(2);

        exp_color = var_color = PrimeColor.raspberry;

        break;
      }
      case 'binomial': {
        const p = (controls?.[2] as number) ?? 0.5;
        const n = (controls?.length ?? 0) > 3 ? ((controls?.[3] as number) ?? 10) : 10;

        expected_value = (n * p).toFixed(2);
        variance = (n * p * (1 - p)).toFixed(2);

        break;
      }
      case 'geometric': {
        const p = (controls?.[2] as number) ?? 0.5;

        expected_value = (1 / p).toFixed(2);
        variance = ((1 - p) / Math.pow(p, 2)).toFixed(2);

        exp_color = var_color = PrimeColor.raspberry;

        break;
      }
      case 'poisson': {
        const lambda = (controls?.[2] as number) ?? 3;

        expected_value = lambda.toFixed(2);
        variance = lambda.toFixed(2);

        exp_color = var_color = PrimeColor.raspberry;

        break;
      }
      case 'uniform_die': {
        const n = (controls?.[2] as number) ?? 6;

        expected_value = ((n + 1) / 2).toFixed(2);
        variance = ((Math.pow(n, 2) - 1) / 12).toFixed(2);

        exp_color = var_color = PrimeColor.blue;

        break;
      }
    }

    return new Formulas(
      new Formula('E(X) &= \\$1').addAutoParam(expected_value, exp_color),
      new Formula('\\text{Var}(X) &= \\$1').addAutoParam(variance, var_color)
    ).align();
  });

  function addFreq(map: { [x: number]: number }, x: number) {
    map[x] = (map[x] ?? 0) + 1;
    return map;
  }

  const randomFn = $derived.by(() => {
    switch (curDistrType?.replace(NS, '')) {
      // continuous
      case 'normal': {
        const mean_ = draggables?.[0]?.position.x ?? 4;
        const sigma = (controls?.[2] as number) ?? 2;

        return randomNormal(mean_, sigma);
      }
      case 'exponential': {
        const lambda = (controls?.[2] as number) ?? 1;

        return randomExponential(lambda);
      }
      case 'pareto': {
        const x0 = draggables?.[0]?.position.x ?? 1;
        const alpha = (controls?.[2] as number) ?? 2;

        const d3Pareto = randomPareto(alpha);
        return () => x0 * d3Pareto();
      }
      case 'uniform': {
        const a = draggables?.[0]?.position.x ?? -2;
        const b = draggables?.[1]?.position.x ?? 8;

        return randomUniform(a, b);
      }
      // discrete
      case 'bernouli': {
        const p = (controls?.[2] as number) ?? 0.5;

        return randomBernoulli(p);
      }
      case 'binomial': {
        const p = (controls?.[2] as number) ?? 0.5;
        const n = (controls?.length ?? 0) > 3 ? ((controls?.[3] as number) ?? 10) : 10;

        return randomBinomial(n, p);
      }
      case 'geometric': {
        const p = (controls?.[2] as number) ?? 0.5;

        return randomGeometric(p);
      }
      case 'poisson': {
        const lambda = (controls?.[2] as number) ?? 3;

        return randomPoisson(lambda);
      }
      case 'uniform_die': {
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
  initialViewBox={new ViewBox(new Vector2(-3, -0.1), new Vector2(10, 1), 0.5)}
  scaleY={10}
>
  <Histogram
    {freqMap}
    isInteger={curCategory === `${NS}discrete`}
    color={PrimeColor.cyan}
    normalized={true}
  />
</Canvas2D>
