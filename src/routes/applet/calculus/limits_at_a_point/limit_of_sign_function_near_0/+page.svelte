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
    new Vector2(-4, -4), // bottom-left
    new Vector2(4, 4), // top-right
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
  const controls = Controls.addSlider(1.5, 0.05, 8, 0.05, PrimeColor.orange, {
    label: 'ε'
  }).addSlider(1, 0.05, 8, 0.05, PrimeColor.raspberry, { label: 'δ' });
  const appletObjects: AppletObject[] = [
    new FunctionFragment('\\frac{|x|}{x}', PrimeColor.blue, {
      isDashed: false,
      shape: 'circle',
      legendText: 'f(x)=\\frac{|x|}{x}',
      domain: { xMax: 0 }
    }).addGaps([new Vector2(0, 1), new Vector2(0, -1)]),
    new FunctionFragment('\\frac{|x|}{x}', PrimeColor.blue, {
      isDashed: false,
      shape: 'circle',
      domain: { xMin: 0 }
    }),
    new FunctionFragment('', PrimeColor.raspberry, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'x=\\pm\\delta'
    }),
    new FunctionFragment('', PrimeColor.orange, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y=\\pm\\varepsilon'
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
>
  <TemplateComponent objects={appletObjects} />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    origin={new Vector2(0, controls[0])}
    color={PrimeColor.orange}
    isDashed={true}
  />
  <InfiniteLine2D
    direction={new Vector2(1, 0)}
    origin={new Vector2(0, -controls[0])}
    color={PrimeColor.orange}
    isDashed={true}
  />
  <InfiniteLine2D
    direction={new Vector2(0, 1)}
    origin={new Vector2(controls[1], 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
  />
  <InfiniteLine2D
    direction={new Vector2(0, 1)}
    origin={new Vector2(-controls[1], 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
  />
</Canvas2D>
