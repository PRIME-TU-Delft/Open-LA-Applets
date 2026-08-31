<script lang="ts">
  import { Controls, type Controller } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Histogram from '$lib/d3/Histogram2D.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { Vector2 } from 'three';
  import { CONTINUOUS_TYPES, DISCRETE_TYPES, DISTRIBUTIONS, NS } from '../distributionRegistry';

  const NSC = 'applets.pts.distributions.central_limit_theorem.';

  // Number of controls before the per-distribution sliders start
  // (here: the draw samples button, average/sum dropdown, N slider).
  const OFFSET = 3;

  const baseControls = Controls.addDropdown(`${NS}continuous`, [
    `${NS}continuous`,
    `${NS}discrete`
  ]);

  const discrete = $derived(baseControls[0] === `${NS}discrete`);

  let savedCategory: string = $state('');
  let savedDistrType: string = $state('');

  const isInDistr = $derived(savedCategory !== '' && savedDistrType !== '');

  const contDiscControls = $derived.by(() => {
    const cont = baseControls.addDropdown(
      discrete ? `${NS}bernouli` : `${NS}normal`,
      (discrete ? DISCRETE_TYPES : CONTINUOUS_TYPES).map((t) => `${NS}${t}`)
    );

    return cont.addButton($_(`${NS}next`), PrimeColor.raspberry, () => {
      savedCategory = cont[0];
      savedDistrType = cont[1];
    });
  });

  const curDistrType: string = $derived(savedDistrType || contDiscControls?.[1]);
  const curCategory: string = $derived(savedCategory || contDiscControls?.[0]);

  const valueFn = (x: number) => x.toFixed(2);
  const valueFnInt = (x: number) => x.toFixed(0);

  let CLT_samples_number = $state(0);
  let CLT_samples_increment = $derived.by(() => {
    if (CLT_samples_number < 5) {
      return 1;
    }
    if (CLT_samples_number < 20) {
      return 5;
    }
    if (CLT_samples_number < 100) {
      return 10;
    }
    if (CLT_samples_number < 300) {
      return 25;
    }

    return 0; // disable the button
  });

  let CLT_samples: number[][] = $state([]);

  const is_average = $derived.by(() => {
    const c = controls?.[1];
    return c && typeof c === 'string' && c.endsWith('average');
  });

  const CLT_histogram = $derived.by(() => {
    const hist: Record<number, number> = {};

    for (const sample of CLT_samples) {
      if (!sample) continue;

      const value = is_average
        ? sample.reduce((a, b) => a + b, 0) / sample.length
        : sample.reduce((a, b) => a + b, 0);
      const bucket = Math.floor(value);
      hist[bucket] = (hist[bucket] ?? 0) + 1;
    }

    return hist;
  });

  function addSamples() {
    const newSamples: number[][] = [];

    for (let i = 0; i < CLT_samples_increment; i++) {
      const sample: number[] = [];
      for (let j = 0; j < N; j++) {
        sample.push(randomFn());
      }
      newSamples.push(sample);
    }

    CLT_samples_number += CLT_samples_increment;
    CLT_samples = [...CLT_samples, ...newSamples];
  }

  const inDistrControls = $derived(
    Controls.addButton(
      $_(`${NSC}drawSamples`).replace('%N', CLT_samples_increment.toString()),
      PrimeColor.pink,
      addSamples
    )
      .addDropdown(`${NSC}average`, [`${NSC}average`, `${NSC}sum`])
      .addSlider(100, 0, 300, 1, PrimeColor.blue, { label: 'N' })
  );

  const controls = $derived.by(() => {
    if (!isInDistr) {
      return contDiscControls;
    }

    const def = DISTRIBUTIONS[savedDistrType.replace(NS, '')];
    if (!def) return undefined;

    return def.sliders.reduce<Controls<unknown, readonly Controller<unknown>[]>>(
      (acc, s) =>
        acc.addSlider(s.default, s.from, s.to, s.step, s.color, {
          label: s.label,
          valueFn: s.integer ? valueFnInt : valueFn
        }),
      inDistrControls
    );
  });

  const N = $derived.by(() => {
    if (typeof controls?.[2] === 'number') {
      return controls?.[2];
    }

    return 200;
  });

  const draggables = $derived.by(() => {
    const key = savedDistrType?.replace(NS, '');
    return key ? (DISTRIBUTIONS[key]?.draggables?.() ?? []) : [];
  });

  const extraValues = $derived.by(() => {
    if (!isInDistr) return [];
    return (controls?.getAll() ?? []).slice(OFFSET).map((c) => c.value as number);
  });

  const formulas = $derived.by(() => {
    const def = DISTRIBUTIONS[curDistrType?.replace(NS, '')];

    if (!def) {
      return new Formulas(
        new Formula('E(X) &= \\$1').addAutoParam(0, PrimeColor.black),
        new Formula('\\text{Var}(X) &= \\$1').addAutoParam(0, PrimeColor.black)
      ).align();
    }

    const m = def.moments(extraValues, draggables);

    return new Formulas(
      new Formula('E(X) &= \\$1').addAutoParam(m.expectedValue, m.expColor),
      new Formula('\\text{Var}(X) &= \\$1').addAutoParam(m.variance, m.varColor)
    ).align();
  });

  const splitFormulas = $derived.by(() => {
    const def = DISTRIBUTIONS[curDistrType?.replace(NS, '')];

    if (!def) {
      return new Formulas(
        new Formula('E(X) &= \\$1').addAutoParam(0, PrimeColor.black),
        new Formula('\\text{Var}(X) &= \\$1').addAutoParam(0, PrimeColor.black)
      ).align();
    }

    return new Formulas(
      new Formula('E(X) &= \\$1').addAutoParam(999),
      new Formula('\\text{Var}(X) &= \\$1').addAutoParam(999),
      new Formula('k &= \\$1').addAutoParam(CLT_samples_number, PrimeColor.pink)
    ).align();
  });

  function addFreq(map: { [x: number]: number }, x: number) {
    map[x] = (map[x] ?? 0) + 1;
    return map;
  }

  const randomFn = $derived.by(() => {
    const def = DISTRIBUTIONS[curDistrType?.replace(NS, '')];
    return def ? def.sampler(extraValues, draggables) : () => 0;
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
    CLT_samples_number = 0;
    CLT_samples = [];
  }}
  initialViewBox={new ViewBox(new Vector2(-3, -0.1), new Vector2(10, 1), 0.5)}
  scaleY={10}
  title={$_(`${NSC}title`)}
  splitCanvas2DProps={{
    initialViewBox: new ViewBox(new Vector2(-3, -0.1), new Vector2(10, 1), 0.5),
    scaleY: 10
    // @todo: for some reason the right canvas is slightly shifted downwards?
  }}
  {splitFormulas}
>
  <Histogram
    {freqMap}
    isInteger={curCategory === `${NS}discrete`}
    color={PrimeColor.cyan}
    normalized={true}
  />

  {#snippet splitCanvas2DChildren()}
    <Histogram
      freqMap={CLT_histogram}
      isInteger={false}
      color={PrimeColor.pink}
      normalized={true}
    />
  {/snippet}
</Canvas2D>
