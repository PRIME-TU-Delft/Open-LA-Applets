<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
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
  const controls = Controls.addToggle(false, toLatexText('$f_{\\text{ext}}(x)$'), PrimeColor.yellow)
    .addToggle(false, toLatexText('$g_{\\text{ext}}(x)$'), PrimeColor.raspberry)
    .addToggle(true, toLatexText('$f_{\\text{ext}}(x)+g_{\\text{ext}}(x)$'), PrimeColor.darkGreen);
  const periodStarts = Array.from({ length: 16 }, (_, i) => -32 + i * 4);
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
  {#if controls[2]}
    {#each periodStarts as xStart (xStart)}
      <Line2D
        start={new Vector2(xStart, 1)}
        end={new Vector2(xStart + 1, 1)}
        color={PrimeColor.darkGreen}
      />
      <Line2D
        start={new Vector2(xStart + 1, 0)}
        end={new Vector2(xStart + 2, 0)}
        color={PrimeColor.darkGreen}
      />
      <Line2D
        start={new Vector2(xStart + 2, 1)}
        end={new Vector2(xStart + 3, 1)}
        color={PrimeColor.darkGreen}
      />
      <Line2D
        start={new Vector2(xStart + 3, 0)}
        end={new Vector2(xStart + 4, 0)}
        color={PrimeColor.darkGreen}
      />
      <Point2D
        position={new Vector2(xStart, 1)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.darkGreen}
      />
      <Point2D
        position={new Vector2(xStart + 2, 1)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.darkGreen}
      />
      <Point2D
        position={new Vector2(xStart + 1, 1)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.white}
      />
      <Point2D
        position={new Vector2(xStart + 3, 1)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.white}
      />
      <Point2D
        position={new Vector2(xStart + 1, 0)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.darkGreen}
      />
      <Point2D
        position={new Vector2(xStart + 3, 0)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.darkGreen}
      />
      <Point2D
        position={new Vector2(xStart + 2, 0)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.white}
      />
      <Point2D
        position={new Vector2(xStart + 4, 0)}
        color={PrimeColor.darkGreen}
        fill={PrimeColor.white}
      />
    {/each}
  {/if}
  {#if controls[0]}
    // make a loop over the range of x values to plot the odd extension
    {#each periodStarts as xStart (xStart)}
      <Line2D
        start={new Vector2(xStart, 1)}
        end={new Vector2(xStart + 1, 1)}
        color={PrimeColor.yellow}
        isDashed={true}
      />
      <Line2D
        start={new Vector2(xStart + 1, 0)}
        end={new Vector2(xStart + 4, 0)}
        color={PrimeColor.yellow}
        isDashed={true}
      />
      <Point2D
        position={new Vector2(xStart, 1)}
        color={PrimeColor.yellow}
        fill={PrimeColor.yellow}
      />
      <Point2D
        position={new Vector2(xStart + 1, 1)}
        color={PrimeColor.yellow}
        fill={PrimeColor.white}
      />
      <Point2D
        position={new Vector2(xStart + 1, 0)}
        color={PrimeColor.yellow}
        fill={PrimeColor.yellow}
      />
      <Point2D
        position={new Vector2(xStart + 4, 0)}
        color={PrimeColor.yellow}
        fill={PrimeColor.white}
      />
    {/each}
  {/if}
  {#if controls[1]}
    {#each periodStarts.slice(0, -1) as xStart (xStart)}
      <Line2D
        start={new Vector2(xStart + 2, 1)}
        end={new Vector2(xStart + 3, 1)}
        color={PrimeColor.raspberry}
        isDashed={true}
      />
      <Line2D
        start={new Vector2(xStart + 3, 0)}
        end={new Vector2(xStart + 6, 0)}
        color={PrimeColor.raspberry}
        isDashed={true}
      />
      <Point2D
        position={new Vector2(xStart + 2, 1)}
        color={PrimeColor.raspberry}
        fill={PrimeColor.raspberry}
      />
      <Point2D
        position={new Vector2(xStart + 3, 1)}
        color={PrimeColor.raspberry}
        fill={PrimeColor.white}
      />
      <Point2D
        position={new Vector2(xStart + 3, 0)}
        color={PrimeColor.raspberry}
        fill={PrimeColor.raspberry}
      />
      <Point2D
        position={new Vector2(xStart + 6, 0)}
        color={PrimeColor.raspberry}
        fill={PrimeColor.white}
      />
    {/each}
  {/if}
</Canvas2D>
