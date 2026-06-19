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
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addToggle(true, toLatexText('$r$'), PrimeColor.blue)
    .addToggle(true, toLatexText('$s$'), PrimeColor.yellow)
    .addToggle(true, toLatexText('$rs$'), PrimeColor.darkGreen);
  function r(x: number): number {
    return x ** 3;
  }
  function s(x: number): number {
    return 1 / x;
  }
  function rs(x: number): number {
    return r(x) * s(x);
  }
  const appletObjects: AppletObject[] = [
    new FunctionFragment('', PrimeColor.blue, { legendText: 'r(t) = t^3' }),
    new FunctionFragment('', PrimeColor.yellow, {
      legendText: 's(t) = \\frac{1}{t}'
    }),
    new FunctionFragment('', PrimeColor.darkGreen, { legendText: 'rs(t) = r(t) \\cdot s(t)' })
  ];
  function snapToFunctionR(position: Vector2) {
    const oldx = position.x;
    let x = Number(position.x.toFixed(1));
    if (x === 0) {
      x = Math.sign(oldx) * 0.1;
    }
    let y = r(x);
    return new Vector2(x, y);
  }
  const xDstart = 1.5;
  const draggables = [
    new Draggable(new Vector2(xDstart, r(xDstart)), PrimeColor.blue, undefined, snapToFunctionR)
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
  {#if controls[2]}
    <ExplicitFunction2D func={rs} color={PrimeColor.darkGreen} />
    <Point2D
      position={new Vector2(0, 0)}
      color={PrimeColor.darkGreen}
      fill={PrimeColor.white}
      shape="square"
    />
  {/if}
  {#if controls[0]}
    <ExplicitFunction2D func={r} color={PrimeColor.blue} />
    <Point2D position={new Vector2(0, 0)} color={PrimeColor.blue} fill={PrimeColor.white} />
  {/if}
  {#if controls[1]}
    <ExplicitFunction2D func={s} color={PrimeColor.yellow} />
  {/if}
</Canvas2D>
