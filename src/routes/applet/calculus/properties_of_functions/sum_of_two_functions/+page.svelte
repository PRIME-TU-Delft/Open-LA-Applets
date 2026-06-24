<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';

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
  cameraZoom = 1.5;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -5), // bottom-left
    new Vector2(4, 6), // top-right
    0.5 // margin
  );

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
  const controls = Controls.addToggle(true, toLatexText('$g$'), PrimeColor.blue)
    .addToggle(true, toLatexText('$h$'), PrimeColor.yellow)
    .addToggle(true, toLatexText('$f$'), PrimeColor.darkGreen);
  function g(x: number): number {
    return Math.sin(x);
  }
  function h(x: number): number {
    return x / 2;
  }
  function f(x: number): number {
    return g(x) + h(x);
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment('', PrimeColor.blue, { legendText: 'g(x) = \\sin(x)' }),
    new FunctionFragment('', PrimeColor.yellow, {
      legendText: 'h(x) = \\frac{x}{2}',
      isDashed: true
    }),
    new FunctionFragment('', PrimeColor.darkGreen, { legendText: 'f(x) = g(x) + h(x)' })
  ];
  function snapToFunction(position: Vector2) {
    let x = Number(position.x.toFixed(1));
    let y = g(x);
    return new Vector2(x, y);
  }
  const xDstart = 3.5;
  const draggables = [
    new Draggable(new Vector2(xDstart, g(xDstart)), PrimeColor.blue, undefined, snapToFunction)
  ];
  let xD = $derived(draggables[0].position.x);
  let yD = $derived(draggables[0].position.y);
</script>

<Canvas2D
  {draggables}
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  legendFormulaPosition="top-left"
>
  <TemplateComponent objects={appletObjects} />
  {#if controls[0]}
    <ExplicitFunction2D func={g} color={PrimeColor.blue} />
  {/if}
  {#if controls[1]}
    <ExplicitFunction2D func={h} color={PrimeColor.yellow} isDashed={true} />
  {/if}
  {#if controls[2]}
    <ExplicitFunction2D func={f} color={PrimeColor.darkGreen} />
  {/if}
  <Point2D color={PrimeColor.darkGreen} position={new Vector2(xD, f(xD))} shape="square" />
  <Vector2D
    color={PrimeColor.yellow}
    origin={new Vector2(xD, yD)}
    direction={new Vector2(0, f(xD) - yD)}
    length={Math.sqrt((yD - f(xD)) ** 2)}
  ></Vector2D>
  <Latex2D
    latex={'h(' + xD.toFixed(1) + ')'}
    color={PrimeColor.yellow}
    position={new Vector2(xD + (xD > 0 ? 0.1 : -0.1), (yD + f(xD)) / 2)}
    alignX={xD > 0 ? 'left' : 'right'}
    alignY="center"
  />
</Canvas2D>
