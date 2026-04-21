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

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-1, -1), // bottom-left
    new Vector2(7, 6), // top-right
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
  const controls = Controls.addSlider(1, 0.05, 8, 0.05, PrimeColor.orange, {
    label: 'ε'
  });
  const appletObjects: AppletObject[] = [
    new FunctionFragment('x^2', PrimeColor.blue, {
      isDashed: false,
      shape: 'square',
      legendText: 'f(x)=x^2'
    }),
    new FunctionFragment('', PrimeColor.darkGreen, {
      isDashed: false,
      shape: 'circle',
      legendText: '\\left(2,4\\right)'
    }).addIncludedPoints(new Vector2(2, 4)),
    new FunctionFragment('', PrimeColor.raspberry, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'x=2\\pm\\delta'
    }),
    new FunctionFragment('', PrimeColor.orange, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y=4\\pm\\varepsilon'
    })
  ];
  let delta = $derived(
    controls[0] > 4
      ? Math.min(2, Math.sqrt(4 + controls[0]) - 2)
      : Math.min(2 - Math.sqrt(4 - controls[0]), Math.sqrt(4 + controls[0]) - 2)
  );
</script>

<Canvas2D
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    origin={new Vector2(0, 4 + controls[0])}
    color={PrimeColor.orange}
    isDashed={true}
  />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    origin={new Vector2(0, 4 - controls[0])}
    color={PrimeColor.orange}
    isDashed={true}
  />
  <InfiniteLine2D
    direction={new Vector2(0, 1)}
    origin={new Vector2(2 + delta, 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
  />
  <InfiniteLine2D
    direction={new Vector2(0, 1)}
    origin={new Vector2(2 - delta, 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
  />
</Canvas2D>
