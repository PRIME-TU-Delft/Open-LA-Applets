<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';

  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  cameraPosition = new Vector2(3, 1);
  cameraZoom = 1.0;

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
  let scaleY = 1;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = '\\theta';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(1, 0.1, 5, 0.1, PrimeColor.yellow, {
    label: toLatexText('$n$'),
    valueFn: (v: number) => v.toFixed(1).replace('.0', ''),
    animationStep: 0.1
  })
    .addToggle(true, toLatexText('$f$'), PrimeColor.blue)
    .addToggle(true, toLatexText('$g$'), PrimeColor.raspberry)
    .addToggle(true, toLatexText('$h$'), PrimeColor.darkGreen)
    .addToggle(true, toLatexText('Asymptotes'), PrimeColor.orange);

  let f = $derived((x: number) => Math.cos(controls[0] * x));
  let g = $derived((x: number) => Math.sin(controls[0] * x));
  let h = $derived((x: number) => Math.tan(controls[0] * x));

  const maxAsymptotes = $derived(Math.ceil(30 / (Math.PI / controls[0])));

  function CosLegend() {
    const n = controls[0];
    return 'f(\\theta)=\\cos(' + (n !== 1 ? n.toFixed(1).replace('.0', '') : '') + '\\theta)';
  }
  function SinLegend() {
    const n = controls[0];
    return 'g(\\theta)=\\sin(' + (n !== 1 ? n.toFixed(1).replace('.0', '') : '') + '\\theta)';
  }
  function TanLegend() {
    const n = controls[0];
    return 'h(\\theta)=\\tan(' + (n !== 1 ? n.toFixed(1).replace('.0', '') : '') + '\\theta)';
  }
  function ThetaLegend() {
    const n = controls[0];
    const twon = 2 * n;
    if (twon === 1) {
      return (
        '\\theta = \\pi+k\\frac{\\pi}{' + n.toFixed(1).replace('.0', '') + '}, k \\in \\mathbb{Z}'
      );
    }
    if (twon === 2) {
      return (
        '\\theta = \\frac{\\pi}{' +
        twon.toFixed(1).replace('.0', '') +
        '}+k\\pi, k \\in \\mathbb{Z}'
      );
    }
    return (
      '\\theta = \\frac{\\pi}{' +
      twon.toFixed(1).replace('.0', '') +
      '}+k\\frac{\\pi}{' +
      n.toFixed(1).replace('.0', '') +
      '}, k \\in \\mathbb{Z}'
    );
  }
  const legendItems = $derived([
    new LegendItem(CosLegend(), PrimeColor.blue),
    new LegendItem(SinLegend(), PrimeColor.raspberry),
    new LegendItem(TanLegend(), PrimeColor.darkGreen),
    new LegendItem(ThetaLegend(), PrimeColor.orange)
  ]);
</script>

<Canvas2D
  {controls}
  {cameraPosition}
  {cameraZoom}
  {legendItems}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {#if controls[1]}
    <ExplicitFunction2D func={f} color={PrimeColor.blue} />
  {/if}
  {#if controls[2]}
    <ExplicitFunction2D func={g} color={PrimeColor.raspberry} />
  {/if}
  {#if controls[3]}
    <ExplicitFunction2D func={h} color={PrimeColor.darkGreen} />
  {/if}
  {#if controls[4]}
    {#each Array.from({ length: maxAsymptotes }) as _, i}
      <InfiniteLine2D
        direction={new Vector2(0, 1)}
        color={PrimeColor.orange}
        origin={new Vector2(Math.PI / 2 / controls[0] + (i * Math.PI) / controls[0], 0)}
        isDashed={true}
      />
      <InfiniteLine2D
        direction={new Vector2(0, 1)}
        color={PrimeColor.orange}
        origin={new Vector2(-Math.PI / 2 / controls[0] - (i * Math.PI) / controls[0], 0)}
        isDashed={true}
      />
    {/each}
  {/if}
</Canvas2D>
