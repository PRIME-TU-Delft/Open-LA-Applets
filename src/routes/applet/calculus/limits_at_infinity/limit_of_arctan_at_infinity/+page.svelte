<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */ // For ease of creating the template applets
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment,
    ObliqueAsymptoteFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Axis from '$lib/d3/Axis.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import { Controls } from '$lib/controls/Controls';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import AxisProps from '$lib/d3/Axis.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';

  // svelte-ignore non_reactive_update
  let initialViewBox: ViewBox | undefined;
  // svelte-ignore non_reactive_update
  let cameraPosition: Vector2 | undefined;
  // svelte-ignore non_reactive_update
  let cameraZoom: number | undefined;
  // svelte-ignore non_reactive_update
  let xAxisLabel: string | undefined;
  // svelte-ignore non_reactive_update
  let yAxisLabel: string | undefined;

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
  cameraZoom = 1.5;

  const factorX = 1 / 3;
  const factorY = 2;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-21 * factorX, -3 * factorY), // bottom-left
    new Vector2(21 * factorX, 2 * factorY), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(0.2, 0, 4, 0.05, PrimeColor.orange, {
    label: 'ε'
  });
  let N = $derived(
    controls[0] >= Math.PI
      ? -30 / factorX
      : Math.min(Math.max(-30 / factorX, Math.tan(Math.PI / 2 - controls[0])), 30 / factorX) // To make sure the vertical lines don't intersect with the function
  );
  const appletObjects: AppletObject[] = [
    new FunctionFragment(factorY + '*\\arctan(x*' + 1 / factorX + ')', PrimeColor.blue, {
      isDashed: false,
      shape: 'square',
      legendText: '\\arctan(x)'
    }),
    new FunctionFragment('', PrimeColor.black, {
      isDashed: false,
      shape: 'circle',
      legendText: '\\tan(x)'
    }),
    new FunctionFragment('', PrimeColor.darkGreen, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'x\\text{ or }y=N'
    }),
    new FunctionFragment('', PrimeColor.orange, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y\\text{ or }x=\\frac{\\pi}{2}-\\varepsilon'
    })
  ];
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={null}
  position="top-left"
  splitCanvas2DProps={{
    labels: { xLabel: 'x', yLabel: 'y' },
    axis: {
      scaleX: factorY,
      scaleY: factorX
    }
  }}
>
  <TemplateComponent objects={appletObjects} />
  <Axis scaleX={factorX} scaleY={factorY} />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    origin={new Vector2(0, factorY * (Math.PI / 2 - controls[0]))}
    color={PrimeColor.orange}
    isDashed={true}
  />
  <InfiniteLine2D
    direction={new Vector2(0, 1)}
    origin={new Vector2(N * factorX, 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
  />
  // add a snippet that exactly mirrors the other part around the y=x line.
  {#snippet splitCanvas2DChildren()}
    <InfiniteLine2D
      direction={new Vector2(0, 1)}
      origin={new Vector2(factorY * (Math.PI / 2 - controls[0]), 0)}
      color={PrimeColor.orange}
      isDashed={true}
    />
    <InfiniteLine2D
      direction={new Vector2(1, 0)}
      origin={new Vector2(0, N * factorX)}
      color={PrimeColor.darkGreen}
      isDashed={true}
    />
    <ExplicitFunction2D
      func={(x: number) => Math.tan(x / factorY) * factorX}
      color={PrimeColor.black}
      xMin={(-Math.PI / 2) * factorY}
      xMax={(Math.PI / 2) * factorY}
    />
  {/snippet}
</Canvas2D>
