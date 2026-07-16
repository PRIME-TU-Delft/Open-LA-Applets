<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { Controls } from '$lib/controls/Controls';

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
  cameraPosition = new Vector2(0.5, 0);
  cameraZoom = 2;

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
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const FunctionF = (x: number) => x ** 4;
  const FunctionG = (x: number) => 5 * x ** 5;
  const FunctionH = (x: number) => (-1 / 6) * x ** 6;
  const appletObjects: AppletObject[] = [
    new Point(new Vector2(0, 0), PrimeColor.orange, {
      radius: 0.1,
      legendText: '(0,0)'
    })
  ];

  const controls = Controls.addToggle(true, toLatexText('$f(x)=x^4$'), PrimeColor.blue)
    .addToggle(true, toLatexText('$g(x)=5x^5$'), PrimeColor.raspberry)
    .addToggle(true, toLatexText('$h(x)=-\\frac{1}{6}x^6$'), PrimeColor.darkGreen);
</script>

<Canvas2D
  {controls}
  {cameraPosition}
  {cameraZoom}
  legendItems={controls[0] || controls[1] || controls[2] ? getLegend(appletObjects) : undefined}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {#if controls[0]}
    <ExplicitFunction2D func={FunctionF} color={PrimeColor.blue} width={0.06} />
  {/if}
  {#if controls[1]}
    <ExplicitFunction2D func={FunctionG} color={PrimeColor.raspberry} width={0.06} />
  {/if}
  {#if controls[2]}
    <ExplicitFunction2D func={FunctionH} color={PrimeColor.darkGreen} width={0.06} />
  {/if}

  {#if controls[0] || controls[1] || controls[2]}
    <TemplateComponent objects={appletObjects} />
  {/if}
</Canvas2D>
