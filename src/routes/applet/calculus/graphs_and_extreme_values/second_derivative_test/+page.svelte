<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment, Point } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';

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
  cameraPosition = new Vector2(1, 1);
  cameraZoom = 1.25;

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
  let scaleX = 2;
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
  const Function = (x: number) => x ** 4 + 2 * Math.cos(x);
  const Derivative = (x: number) => 4 * x ** 3 - 2 * Math.sin(x);
  const SecondDerivative = (x: number) => 12 * x ** 2 - 2 * Math.cos(x);
  const x1 = 0.6799644528423346;
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Function, PrimeColor.blue, {
      legendText: 'f(x)=x^4 + 2\\cos(x)',
      width: 0.06
    }),
    new FunctionFragment(Derivative, PrimeColor.raspberry, {
      legendText: "f'(x)=4x^3 - 2\\sin(x)",
      width: 0.06
    }),
    new FunctionFragment(SecondDerivative, PrimeColor.darkGreen, {
      legendText: "f''(x)=12x^2 - 2\\cos(x)",
      width: 0.06
    }),
    new Point(new Vector2(0, Function(0)), PrimeColor.orange, {
      legendText: '\\text{Local maximum}',
      radius: 0.1,
      shape: 'square'
    }),
    new Point(new Vector2(x1, Function(x1)), PrimeColor.pink, {
      legendText: '\\text{Local minimum}',
      radius: 0.1,
      shape: 'triangle'
    }),
    new Point(new Vector2(-x1, Function(-x1)), PrimeColor.pink, { radius: 0.1, shape: 'triangle' })
  ];
  const controls = Controls.addToggle(true, toLatexText('$f$'), PrimeColor.blue)
    .addToggle(true, toLatexText("$f'$"), PrimeColor.raspberry)
    .addToggle(true, toLatexText("$f''$"), PrimeColor.darkGreen);
</script>

<Canvas2D
  {controls}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {#if controls[0]}
    <TemplateComponent
      objects={[appletObjects[0], appletObjects[3], appletObjects[4], appletObjects[5]]}
    />
  {/if}
  {#if controls[1]}
    <TemplateComponent objects={[appletObjects[1]]} />
  {/if}
  {#if controls[2]}
    <TemplateComponent objects={[appletObjects[2]]} />
  {/if}
</Canvas2D>
