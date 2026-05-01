<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // For ease of creating the template applets
  import {
    Angle,
    AppletObject,
    AsymptoteFragment,
    Circle,
    FunctionFragment,
    ImplicitFunctionFragment,
    LineFragment,
    ObliqueAsymptoteFragment,
    ParameterizedFunctionFragment,
    Point,
    Polygon,
    Text
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import Legend from '$lib/stories/Legend.stories.svelte';
  import { Controls } from '$lib/controls/Controls';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';

  let initialViewBox: ViewBox | undefined;
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
  cameraZoom = 1.25;

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  const scaleX = 1;
  const scaleY = 1 / 2;

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    scaleX: scaleX,
    scaleY: scaleY,
    skipX: 0,
    skipY: 0
  };

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  let a = -1;
  let b = 2;
  let c = 4;
  let scale = 0.2;
  let C = -4;
  let shift = 1;
  let G = (x: number) =>
    scale *
    (x ** 4 / 4 -
      ((a + b + c) / 3) * x ** 3 +
      ((a * b + b * c + c * a) / 2) * x ** 2 -
      a * b * c * x);
  let K = (x: number) => G(x) + C;
  let F = (x: number) => -G(x);
  let H = (x: number) => G(x - shift);
  let L = (x: number) => G(x - shift) + C;

  const toggleControls = Controls.addToggle(true, 'F', PrimeColor.blue)
    .addToggle(true, 'G', PrimeColor.orange)
    .addToggle(true, 'H', PrimeColor.darkGreen)
    .addToggle(true, 'K', PrimeColor.raspberry)
    .addToggle(true, 'L', PrimeColor.yellow);

  const appletObjects: AppletObject[] = [
    new FunctionFragment('', PrimeColor.blue, {
      legendText: `y=F(x)`,
      isDashed: false
    }),
    new FunctionFragment('', PrimeColor.orange, {
      legendText: `y=G(x)`,
      isDashed: false
    }),
    new FunctionFragment('', PrimeColor.darkGreen, {
      legendText: `y=H(x)`,
      isDashed: false
    }),
    new FunctionFragment('', PrimeColor.raspberry, {
      legendText: `y=K(x)`,
      isDashed: false
    }),
    new FunctionFragment('', PrimeColor.yellow, {
      legendText: `y=L(x)`,
      isDashed: false
    })
  ];
</script>

<Canvas2D
  // {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  controls={toggleControls}
>
  <TemplateComponent objects={appletObjects} />
  {#if toggleControls[0]}
    <ExplicitFunction2D func={(x: number) => F(x / scaleX) * scaleY} color={PrimeColor.blue} />
  {/if}
  {#if toggleControls[1]}
    <ExplicitFunction2D func={(x: number) => G(x / scaleX) * scaleY} color={PrimeColor.orange} />
  {/if}
  {#if toggleControls[2]}
    <ExplicitFunction2D func={(x: number) => H(x / scaleX) * scaleY} color={PrimeColor.darkGreen} />
  {/if}
  {#if toggleControls[3]}
    <ExplicitFunction2D func={(x: number) => K(x / scaleX) * scaleY} color={PrimeColor.raspberry} />
  {/if}
  {#if toggleControls[4]}
    <ExplicitFunction2D func={(x: number) => L(x / scaleX) * scaleY} color={PrimeColor.yellow} />
  {/if}
</Canvas2D>
