<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { toLatexText } from '$lib/utils/FormatString';
  import { Formula } from '$lib/utils/Formulas';
  import { LegendItem } from '$lib/utils/Legend';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { Vector2 } from 'three';

  let func = (t: number) => {
    return Math.sqrt(1 + Math.pow(Math.cos(t), 2));
  };
  let I = 1.058095501; // TODO: actually calculate it?

  let L = 0;
  let R = Math.PI / 4;

  let area = (xL: number, xR: number) => {
    return {
      left: func(xL) * (xR - xL),
      right: func(xR) * (xR - xL),
      trapezoid: ((func(xL) + func(xR)) * (xR - xL)) / 2
    };
  };

  let areaFull = (L: number, H: number, N: number) => {
    let currentArea = {
      left: 0,
      right: 0,
      trapezoid: 0
    };

    for (let i = 0; i < N; i++) {
      let x = L + i * H;
      let a = area(x, x + H);

      currentArea['left'] += a['left'];
      currentArea['right'] += a['right'];
      currentArea['trapezoid'] += a['trapezoid'];
    }

    return currentArea;
  };

  let animationOn = $state(false);

  const controls = Controls.addSlider(6, 1, 50, 1, PrimeColor.raspberry, {
    label: 'h',
    valueFn: (v: number) => round(1 / (4 * Math.round(v)), 4) + 'π',
    onStartChanging: () => {
      animationOn = true;
    },
    onStopChanging: () => {
      animationOn = false;
    },
    animationStep: 1
  })
    .addToggle(
      true,
      toLatexText($_('applets.calculus.integration.method_errors.left')),
      PrimeColor.orange
    )
    .addToggle(
      true,
      toLatexText($_('applets.calculus.integration.method_errors.right')),
      PrimeColor.blue
    )
    .addToggle(
      true,
      toLatexText($_('applets.calculus.integration.method_errors.trapezoid')),
      PrimeColor.darkGreen
    );

  const formulas = $derived.by(() => {
    return [
      new Formula('f(t) = \\sqrt{1+\\cos^2(t)}'),
      new Formula('\\int_0^{\\frac{\\pi}{4}} f(t) \\; \\text{d}t \\approx 1.058')
    ];
  });

  const legendItems = $derived([
    new LegendItem($_('applets.calculus.integration.method_errors.left'), PrimeColor.orange),
    new LegendItem($_('applets.calculus.integration.method_errors.right'), PrimeColor.blue),
    new LegendItem($_('applets.calculus.integration.method_errors.trapezoid'), PrimeColor.darkGreen)
  ]);

  const N = $derived(Math.round(controls[0]));
  const h = $derived((R - L) / N);

  let areaDict = $derived(areaFull(L, h, N));

  type MethodsDict = { left: number; right: number; trapezoid: number };

  let errors = (areaDict: MethodsDict) => {
    return {
      left: Math.abs(I - areaDict['left']),
      right: Math.abs(I - areaDict['right']),
      trapezoid: Math.abs(I - areaDict['trapezoid'])
    };
  };

  let errorsDraggable = $derived(errors(areaDict));

  type PointErrors = {
    pointX: number;
    errors: MethodsDict;
  };

  let errorsPredefined: PointErrors[] = [];

  let Npoints = [1, 2, 4, 8, 16, 32];
  Npoints.forEach((n) => {
    let h = (R - L) / n;
    let a = areaFull(L, h, n);

    errorsPredefined.push({ pointX: h, errors: errors(a) });
  });
</script>

<Canvas2D
  {controls}
  {formulas}
  {legendItems}
  axis={{
    showOrigin: false,
    logarithmicX: true,
    logarithmicY: true,
    scaleX: 2
  }}
  cameraZoom={1.15}
  cameraPosition={new Vector2(-1.4, -2.4)}
  title={$_('applets.calculus.integration.method_errors.title')}
>
  <!-- RE-ADD when axis labels work better
  labels={{
    xLabel: 'h',
    xLabelPosition: 'top-center',
    yLabel: $_('applets.calculus.integration.method_errors.absolute_error'),
    yLabelPosition: 'right-center',
    yLabelRotate: 'right',
    size: 1.5
  }} -->

  <Latex2D latex="h" position={new Vector2(-2.5, 0.55)} />
  <Latex2D
    latex={`\\text{${$_('applets.calculus.integration.method_errors.absolute_error')}}`}
    position={new Vector2(1.95, -1.5)}
    rotation={-90}
  />

  {#each errorsPredefined as pE (pE.pointX)}
    {@const x = 2 * Math.log10(pE.pointX)}
    {@const left = Math.log10(pE.errors['left'])}
    {@const right = Math.log10(pE.errors['right'])}
    {@const trapezoid = Math.log10(pE.errors['trapezoid'])}

    {@const opacity = !animationOn ? PrimeColor.opacity(1) : PrimeColor.opacity(0.5)}

    {#if controls[1]}
      <Point2D position={new Vector2(x, left)} color={PrimeColor.orange + opacity} />
    {/if}
    {#if controls[2]}
      <Point2D position={new Vector2(x, right)} color={PrimeColor.blue + opacity} />
    {/if}
    {#if controls[3]}
      <Point2D position={new Vector2(x, trapezoid)} color={PrimeColor.darkGreen + opacity} />
    {/if}
  {/each}

  {@const hX = 2 * Math.log10(h)}
  {@const opacity = animationOn ? PrimeColor.opacity(1) : PrimeColor.opacity(0.5)}

  {#if controls[1]}
    <Point2D
      position={new Vector2(hX, Math.log10(errorsDraggable['left']))}
      color={PrimeColor.orange + opacity}
    />
  {/if}
  {#if controls[2]}
    <Point2D
      position={new Vector2(hX, Math.log10(errorsDraggable['right']))}
      color={PrimeColor.blue + opacity}
    />
  {/if}
  {#if controls[3]}
    <Point2D
      position={new Vector2(hX, Math.log10(errorsDraggable['trapezoid']))}
      color={PrimeColor.darkGreen + opacity}
    />
  {/if}
</Canvas2D>
