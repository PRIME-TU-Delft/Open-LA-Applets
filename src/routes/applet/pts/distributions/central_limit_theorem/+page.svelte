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
  // (here: the average/sum dropdown plus the N slider).
  const OFFSET = 2;

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

  const inDistrControls = Controls.addDropdown(`${NSC}average`, [
    `${NSC}average`,
    `${NSC}sum`
  ]).addSlider(100, 0, 300, 1, PrimeColor.blue, { label: 'N' });

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
    if (typeof controls?.[1] === 'number') {
      return controls?.[1];
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
  }}
  initialViewBox={new ViewBox(new Vector2(-3, -0.1), new Vector2(10, 1), 0.5)}
  scaleY={10}
  title={$_(`${NSC}title`)}
>
  <Histogram
    {freqMap}
    isInteger={curCategory === `${NS}discrete`}
    color={PrimeColor.cyan}
    normalized={true}
  />
</Canvas2D>
