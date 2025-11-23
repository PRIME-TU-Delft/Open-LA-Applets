<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis from '$lib/d3/Axis.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { LegendItem } from '$lib/utils/Legend';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
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

  let areaFull = (L: number, R: number, H: number) => {
    let current_x = L;

    let currentArea = {
      left: 0,
      right: 0,
      trapezoid: 0
    };

    while (current_x <= R - H) {
      let a = area(current_x, current_x + H);

      currentArea['left'] += a['left'];
      currentArea['right'] += a['right'];
      currentArea['trapezoid'] += a['trapezoid'];

      current_x += H;
    }

    if (current_x < R) {
      let a = area(current_x, R);

      currentArea['left'] += a['left'];
      currentArea['right'] += a['right'];
      currentArea['trapezoid'] += a['trapezoid'];
    }

    return currentArea;
  };

  const controls = Controls.addSlider(1 / 20, 1 / 256, 1 / 4, 0.01, PrimeColor.raspberry, {
    label: 'h',
    valueFn: (v: number) => round(v, 3) + 'π'
  });

  const formulas = $derived.by(() => {
    return [new Formula('f(t) = \\sqrt{1+\\cos^2(t)}')];
  });

  const legendItems = [
    new LegendItem('Left rectangle', PrimeColor.orange),
    new LegendItem('Right rectangle', PrimeColor.blue),
    new LegendItem('Trapezoid', PrimeColor.darkGreen)
  ];

  const h = $derived(Math.PI * controls[0]);

  let areaDict = $derived(areaFull(L, R, h));

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

  let points = [Math.PI / 4, Math.PI / 8, Math.PI / 16, Math.PI / 32, Math.PI / 64, Math.PI / 128];
  points.forEach((p) => {
    let a = areaFull(L, R, p);

    errorsPredefined.push({ pointX: p, errors: errors(a) });
  });
</script>

<Canvas2D
  {controls}
  {formulas}
  {legendItems}
  customAxis={true}
  cameraZoom={1.5}
  cameraPosition={new Vector2(-1.4, -2.4)}
>
  <Axis showOrigin={false} logarithmic={true} scaleX={2} />

  {#each errorsPredefined as pE (pE.pointX)}
    {@const x = 2 * Math.log10(pE.pointX)}
    {@const left = Math.log10(pE.errors['left'])}
    {@const right = Math.log10(pE.errors['right'])}
    {@const trapezoid = Math.log10(pE.errors['trapezoid'])}

    <Point2D position={new Vector2(x, left)} color={PrimeColor.orange} />
    <Point2D position={new Vector2(x, right)} color={PrimeColor.blue} />
    <Point2D position={new Vector2(x, trapezoid)} color={PrimeColor.darkGreen} />
  {/each}

  {@const hX = 2 * Math.log10(h)}

  <Point2D
    position={new Vector2(hX, Math.log10(errorsDraggable['left']))}
    color={PrimeColor.orange + PrimeColor.opacity(0.5)}
  />
  <Point2D
    position={new Vector2(hX, Math.log10(errorsDraggable['right']))}
    color={PrimeColor.blue + PrimeColor.opacity(0.5)}
  />
  <Point2D
    position={new Vector2(hX, Math.log10(errorsDraggable['trapezoid']))}
    color={PrimeColor.darkGreen + PrimeColor.opacity(0.5)}
  />
</Canvas2D>
