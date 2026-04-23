<script lang="ts">
  // For ease of creating the template applets
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment,
    ObliqueAsymptoteFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import ParameterizedFunction2D, {
    type ParameterizedFunction2DProps
  } from '$lib/d3/ParameterizedFunction2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;

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
  const appletObjects: AppletObject[] = [
    new FunctionFragment('', PrimeColor.blue, {
      isDashed: false,
      shape: 'square',
      legendText: 'f(x)=\\sqrt{1-x^2}'
    }),
    new FunctionFragment('x', PrimeColor.raspberry, {
      isDashed: true,
      shape: 'triangle',
      legendText: 'y=x'
    })
  ];
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  position="top-left"
>
  <TemplateComponent objects={appletObjects} />
  <ParameterizedFunction2D
    xFunc={(t) => Math.cos(t)}
    yFunc={(t) => Math.sin(t)}
    tStart={0}
    tEnd={Math.PI / 2}
    color={PrimeColor.blue}
    showArrows={false}
  />
</Canvas2D>
