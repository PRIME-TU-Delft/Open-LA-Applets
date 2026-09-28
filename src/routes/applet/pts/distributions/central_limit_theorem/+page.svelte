<script lang="ts">
  import { Controls, type Controller } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import DotHistogram2D from '$lib/d3/DotHistogram2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Histogram from '$lib/d3/Histogram2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { Vector2 } from 'three';
  import { CONTINUOUS_TYPES, DISCRETE_TYPES, DISTRIBUTIONS, NS } from '../distributionRegistry';
  import { nextBatchSize } from './batchSize';

  const NSC = 'applets.pts.distributions.central_limit_theorem.';

  // Number of controls before the per-distribution sliders start
  // (here: the draw button, the average/sum toggle, and the k slider).
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

  // Each entry is one accumulated sample's k raw draws.
  let samples: number[][] = $state([]);
  // null = auto-follow the most-recently-drawn sample; otherwise a user-picked dot.
  let selectedIndex: number | null = $state(null);

  const draggables = $derived.by(() => {
    const key = savedDistrType?.replace(NS, '');
    return key ? (DISTRIBUTIONS[key]?.draggables?.() ?? []) : [];
  });

  const extraValues = $derived.by(() => {
    if (!isInDistr) return [];
    return (controls?.getAll() ?? []).slice(OFFSET).map((c) => c.value as number);
  });

  const k = $derived.by(() => {
    if (typeof controls?.[2] === 'number') {
      return controls[2];
    }
    return 5;
  });

  const isSum = $derived.by(() => controls?.[1] === `${NSC}sum`);

  // Changing the distribution, its parameters, or the sample size invalidates
  // the accumulated samples (they were drawn under different conditions).
  // Toggling average/sum on its own must NOT clear them.
  const accumulationKey = $derived(
    JSON.stringify({
      distrType: curDistrType,
      k,
      extraValues,
      draggablePositions: draggables.map((d) => ({ x: d.position.x, y: d.position.y }))
    })
  );

  $effect(() => {
    void accumulationKey;
    samples = [];
    selectedIndex = null;
  });

  const randomFn = $derived.by(() => {
    const def = DISTRIBUTIONS[curDistrType?.replace(NS, '')];
    return def ? def.sampler(extraValues, draggables) : () => 0;
  });

  function drawSamples() {
    const batch = nextBatchSize(samples.length);
    if (batch <= 0) return;

    const newSamples: number[][] = [];
    for (let i = 0; i < batch; i++) {
      const draws: number[] = [];
      for (let j = 0; j < k; j++) draws.push(randomFn());
      newSamples.push(draws);
    }

    samples = [...samples, ...newSamples];
    selectedIndex = null;
  }

  const inDistrControls = $derived.by(() => {
    const nextBatch = nextBatchSize(samples.length);
    const drawLabel =
      nextBatch > 0
        ? $_(`${NSC}drawSamples`).replace('%N', nextBatch.toString())
        : $_(`${NSC}maxReached`);

    return Controls.addButton(drawLabel, PrimeColor.pink, drawSamples)
      .addDropdown(`${NSC}average`, [`${NSC}average`, `${NSC}sum`])
      .addSlider(5, 1, 50, 1, PrimeColor.blue, { label: 'k', valueFn: valueFnInt });
  });

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

  // Reduce each accumulated sample to its mean or sum.
  const reducedValues = $derived(
    samples.map((draws) => {
      const sum = draws.reduce((a, b) => a + b, 0);
      return isSum ? sum : sum / draws.length;
    })
  );

  const displayedSampleIndex = $derived(
    selectedIndex ?? (samples.length > 0 ? samples.length - 1 : null)
  );
  const leftDraws = $derived(displayedSampleIndex !== null ? samples[displayedSampleIndex] : []);

  function addFreq(map: { [x: number]: number }, x: number) {
    map[x] = (map[x] ?? 0) + 1;
    return map;
  }

  const freqMap = $derived.by(() => {
    let m: Record<number, number> = {};
    for (const v of leftDraws) m = addFreq(m, Math.floor(v));
    return m;
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

  const baseNumericMoments = $derived.by(() => {
    const def = DISTRIBUTIONS[curDistrType?.replace(NS, '')];
    return def ? def.numericMoments(extraValues, draggables) : null;
  });

  const samplingMoments = $derived.by(() => {
    if (!baseNumericMoments) return null;
    const { mean, variance } = baseNumericMoments;
    return isSum ? { mean: k * mean, variance: k * variance } : { mean, variance: variance / k };
  });

  const splitFormulas = $derived.by(() => {
    if (!samplingMoments) {
      return new Formulas(
        new Formula('E &= \\text{undefined}'),
        new Formula('\\text{Var} &= \\text{undefined}')
      ).align();
    }

    const { mean, variance } = samplingMoments;
    const label = isSum ? 'S_k' : '\\bar X';

    return new Formulas(
      new Formula(`E(${label}) &= \\$1`).addAutoParam(mean, PrimeColor.orange),
      new Formula(`\\text{Var}(${label}) &= \\$1`).addAutoParam(variance, PrimeColor.raspberry)
    ).align();
  });

  // Average mode: right panel shares the same x-domain (and the same normalized
  // [0,1] y-domain/scale) as the left panel, so the means visibly concentrate on
  // the same axis as the raw draws. Sum mode: the right panel gets its own
  // k-times-larger x-domain (a shared axis would squash it), but keeps the same
  // normalized y-domain — the dot histogram is normalized like Histogram2D
  // (height = freq/totalFreq), so it never grows past y=1 regardless of how many
  // samples have been drawn.
  const leftViewBox = new ViewBox(new Vector2(-3, -0.1), new Vector2(10, 1), 0.5);
  const rightDomainScale = $derived(isSum ? k : 1);
  const rightXMin = $derived(-3 * rightDomainScale);
  const rightXMax = $derived(10 * rightDomainScale);
  const rightViewBox = $derived(
    isSum
      ? new ViewBox(new Vector2(rightXMin, -0.1), new Vector2(rightXMax, 1), 0.5 * rightDomainScale)
      : leftViewBox
  );
  const rightBinWidth = $derived(Math.max(0.1, (13 * rightDomainScale) / 30));

  // Some parameter combinations (e.g. sum mode with a large k, or heavy-tailed
  // distributions) push draws well past the default axis length of 30. Extend
  // it generously, and skip rendering gridlines/labels below x=-10 since these
  // distributions rarely draw meaningfully negative values that far out.
  const AXIS_MIN_X = -10;
  const leftAxis = { minX: AXIS_MIN_X, length: 60 };
  const rightAxis = $derived({ minX: AXIS_MIN_X, length: Math.max(60, Math.ceil(rightXMax) + 5) });

  const normalOverlayFn = $derived.by(() => {
    if (samples.length < 25 || !samplingMoments) return null;
    const { mean, variance } = samplingMoments;
    const sd = Math.sqrt(variance);
    if (!isFinite(sd) || sd <= 0) return null;

    // Matches the dot histogram's normalized height (freq/total): the expected
    // fraction of samples in a bin of width rightBinWidth is ~ pdf(x) * rightBinWidth.
    return (x: number) =>
      rightBinWidth * (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / sd) ** 2);
  });
</script>

<Canvas2D
  {controls}
  {draggables}
  {formulas}
  onReset={() => {
    savedCategory = '';
    savedDistrType = '';
    samples = [];
    selectedIndex = null;
  }}
  initialViewBox={leftViewBox}
  scaleY={10}
  axis={leftAxis}
  title={$_(`${NSC}title`)}
  splitCanvas2DProps={{
    initialViewBox: rightViewBox,
    scaleY: 10,
    axis: rightAxis
  }}
  {splitFormulas}
>
  {#if leftDraws.length === 0}
    <Latex2D
      latex={$_(`${NSC}placeholder`)}
      position={new Vector2(3.5, 0.5)}
      color={PrimeColor.black}
    />
  {:else}
    <Histogram
      {freqMap}
      isInteger={curCategory === `${NS}discrete`}
      color={PrimeColor.cyan}
      normalized={true}
    />
  {/if}

  {#snippet splitCanvas2DChildren()}
    <DotHistogram2D
      values={reducedValues}
      binWidth={rightBinWidth}
      normalized={true}
      selectedIndex={displayedSampleIndex}
      color={PrimeColor.cyan.toString()}
      selectedColor={PrimeColor.raspberry.toString()}
      onSelect={(index) => (selectedIndex = index)}
    />

    {#if normalOverlayFn}
      <ExplicitFunction2D
        func={normalOverlayFn}
        color={PrimeColor.black}
        xMin={rightXMin}
        xMax={rightXMax}
      />
    {/if}
  {/snippet}
</Canvas2D>
