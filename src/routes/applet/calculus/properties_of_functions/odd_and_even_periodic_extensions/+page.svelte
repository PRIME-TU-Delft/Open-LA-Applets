<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

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
  cameraPosition = new Vector2(1, 0);
  cameraZoom = 1.5;

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
  const BaseFunction = (x: number) => 2 * x;
  const controls = Controls.addToggle(
    true,
    toLatexText('$f(x)=2x,0\\leq x\\leq 1$'),
    PrimeColor.blue
  )
    .addToggle(true, toLatexText('$f_{\\text{odd}}(x)$'), PrimeColor.raspberry)
    .addToggle(false, toLatexText('$f_{\\text{even}}(x)$'), PrimeColor.darkGreen);
  const periodStarts = Array.from({ length: 31 }, (_, i) => -31 + i * 2);
</script>

<Canvas2D
  {controls}
  {cameraPosition}
  {cameraZoom}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {#if controls[1]}
    // make a loop over the range of x values to plot the odd extension
    {#each periodStarts as xStart}
      <Line2D
        start={new Vector2(xStart, -2)}
        end={new Vector2(xStart + 2, 2)}
        color={PrimeColor.raspberry}
      />
      <Point2D
        position={new Vector2(xStart, -2)}
        color={PrimeColor.raspberry}
        fill={PrimeColor.white}
      />
      <Point2D
        position={new Vector2(xStart + 2, 2)}
        color={PrimeColor.raspberry}
        fill={PrimeColor.raspberry}
      />
    {/each}
  {/if}
  {#if controls[2]}
    {#each periodStarts as xStart}
      <Line2D
        start={new Vector2(xStart, 2)}
        end={new Vector2(xStart + 1, 0)}
        color={PrimeColor.darkGreen}
      />
      <Line2D
        start={new Vector2(xStart + 2, 2)}
        end={new Vector2(xStart + 1, 0)}
        color={PrimeColor.darkGreen}
      />
    {/each}
  {/if}
  {#if controls[0]}
    <ExplicitFunction2D
      func={BaseFunction}
      color={PrimeColor.blue}
      xMin={0}
      xMax={1}
      isDashed={false}
    />
    <Point2D position={new Vector2(0, 0)} color={PrimeColor.blue} fill={PrimeColor.blue} />
    <Point2D position={new Vector2(1, 2)} color={PrimeColor.blue} fill={PrimeColor.blue} />
  {/if}
</Canvas2D>
