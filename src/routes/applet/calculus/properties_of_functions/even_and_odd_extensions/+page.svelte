<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';

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
    new Vector2(-3, -7), // bottom-left
    new Vector2(4, 7), // top-right
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

  const controls = Controls.addFunction('\\frac{1}{3}x^3-x^2+2', 'f(x)', PrimeColor.blue, 'x')
    .addToggle(true, toLatexText('Even'), PrimeColor.yellow)
    .addToggle(true, toLatexText('Odd'), PrimeColor.raspberry)
    .addToggle(true, toLatexText('Original'), PrimeColor.blue);
  function OriginalFunction(x: number) {
    return controls[0](x);
  }
  function EvenFunction(x: number) {
    if (x >= 0) {
      return controls[0](x);
    } else {
      return controls[0](-x);
    }
  }
  function OddFunction(x: number) {
    if (x >= 0) {
      return controls[0](x);
    } else {
      return -controls[0](-x);
    }
  }
  function snapToFunction(position: Vector2) {
    let x = Number(Math.max(0, position.x).toFixed(1));
    let y = OriginalFunction(x);
    return new Vector2(x, y);
  }
  const xDstart = 1.1;
  const draggables = [
    new Draggable(
      new Vector2(xDstart, OriginalFunction(xDstart)),
      PrimeColor.darkGreen,
      undefined,
      snapToFunction
    )
  ];
  let xD = $derived(draggables[0].position.x);
  let yD = $derived(draggables[0].position.y);

  $effect(() => {
    // Whenever the function changes, re-snap the draggable position
    draggables[0].position = new Vector2(xD, yD);
  });
</script>

<Canvas2D
  draggables={controls[1] || controls[2] || controls[3] ? draggables : []}
  {controls}
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {#if controls[1]}
    <ExplicitFunction2D func={EvenFunction} color={PrimeColor.yellow}></ExplicitFunction2D>
    {#if xD !== 0}
      <Point2D
        color={PrimeColor.yellow}
        position={new Vector2(-xD, EvenFunction(-xD))}
        shape="square"
      />
      <Line2D
        color={PrimeColor.yellow}
        start={new Vector2(-xD, EvenFunction(-xD))}
        end={new Vector2(xD, OriginalFunction(xD))}
        isDashed={true}
      />
    {/if}
  {/if}
  {#if controls[2]}
    <ExplicitFunction2D func={OddFunction} color={PrimeColor.raspberry} xMax={0}
    ></ExplicitFunction2D>
    <ExplicitFunction2D func={OddFunction} color={PrimeColor.raspberry} xMin={0}
    ></ExplicitFunction2D>
    {#if xD !== 0}
      <Point2D
        color={PrimeColor.raspberry}
        position={new Vector2(-xD, OddFunction(-xD))}
        shape="triangle"
      />
      <Line2D
        color={PrimeColor.raspberry}
        start={new Vector2(-xD, OddFunction(-xD))}
        end={new Vector2(xD, OriginalFunction(xD))}
        isDashed={true}
      />
    {/if}
    {#if OriginalFunction(0) !== 0}
      <Point2D
        color={PrimeColor.raspberry}
        position={new Vector2(0, -OriginalFunction(0))}
        shape="circle"
        fill={PrimeColor.white}
      />
      <Point2D
        color={PrimeColor.raspberry}
        position={new Vector2(0, OriginalFunction(0))}
        shape="circle"
        fill={PrimeColor.white}
      />
      <Point2D color={PrimeColor.raspberry} position={new Vector2(0, 0)} shape="circle" />
    {/if}
  {/if}
  {#if controls[3]}
    <ExplicitFunction2D func={OriginalFunction} color={PrimeColor.blue} isDashed={true} xMin={0}
    ></ExplicitFunction2D>
    <Point2D
      color={PrimeColor.blue}
      position={new Vector2(0, OriginalFunction(0))}
      shape="circle"
    />
  {/if}
</Canvas2D>
