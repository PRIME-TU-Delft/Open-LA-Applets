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

  const scaleX = 0.05;
  const scaleY = 2;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-6, -1), // bottom-left
    new Vector2(6, 2), // top-right
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
  const appletObjects: AppletObject[] = [
    new FunctionFragment(scaleY + '\\frac{1}{1+e^{-' + 1 / scaleX + 'x}}', PrimeColor.blue, {
      isDashed: false,
      shape: 'circle',
      legendText: 'f(x)=\\frac{1}{1+e^{-x}}'
    }),
    new FunctionFragment('0*' + scaleY, PrimeColor.darkGreen, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y=0'
    }),
    new FunctionFragment('1*' + scaleY, PrimeColor.raspberry, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y=1'
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={null}
  position="top-left"
>
  <TemplateComponent objects={appletObjects} />
  <Axis {scaleX} {scaleY} />
</Canvas2D>
