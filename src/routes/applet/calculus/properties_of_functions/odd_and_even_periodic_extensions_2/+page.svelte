<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { toLatexText } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
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
  cameraPosition = new Vector2(1, -1);
  cameraZoom = 0.6;

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
  const controls = Controls.addFunction('4-x^2+1', toLatexText('$f(x)$'), PrimeColor.yellow)
    .addToggle(true, undefined, PrimeColor.yellow)
    .addToggle(true, toLatexText('$f_{\\text{odd}}(x)$'), PrimeColor.raspberry)
    .addToggle(false, toLatexText('$f_{\\text{even}}(x)$'), PrimeColor.darkGreen);

  const BaseFunction = (x: number) => controls[0](x);
  function OddBaseFunction(x: number): number {
    if (x > 0) {
      return BaseFunction(x);
    } else {
      return -BaseFunction(-x);
    }
  }
  function EvenBaseFunction(x: number): number {
    if (x > 0) {
      return BaseFunction(x);
    } else {
      return BaseFunction(-x);
    }
  }
  const periodStarts = Array.from({ length: 15 }, (_, i) => -30 + i * 4);
  const MoveX = (x: number) => {
    const periodLength = 4;
    const periodIndex = Math.floor(x / periodLength);
    const xInPeriod = x - periodIndex * periodLength;
    if (xInPeriod > periodLength / 2) {
      return xInPeriod - periodLength;
    }
    return xInPeriod;
  };
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
      <ExplicitFunction2D
        func={(x: number) => OddBaseFunction(MoveX(x))}
        xMin={BaseFunction(2) !== 0 ? xStart + 0.0000001 : xStart}
        xMax={BaseFunction(0) !== 0 ? xStart + 1.9999999 : xStart + 2}
        color={PrimeColor.raspberry}
      />
      <ExplicitFunction2D
        func={(x: number) => OddBaseFunction(MoveX(x))}
        xMin={BaseFunction(0) !== 0 ? xStart + 2.0000001 : xStart + 2}
        xMax={BaseFunction(2) !== 0 ? xStart + 3.9999999 : xStart + 4}
        color={PrimeColor.raspberry}
      />
      // add points at the ends of the lines, if needed // if BaseFunction(0) is not 0, then add a closed
      point at (0, 0), and open points at (0, BaseFunction(0)) and (0, -BaseFunction(0))
      {#if BaseFunction(0) !== 0}
        <Point2D
          position={new Vector2(xStart + 2, 0)}
          color={PrimeColor.raspberry}
          fill={PrimeColor.raspberry}
        />
        <Point2D
          position={new Vector2(xStart + 2, BaseFunction(0))}
          color={PrimeColor.raspberry}
          fill={PrimeColor.white}
        />
        <Point2D
          position={new Vector2(xStart + 2, -BaseFunction(0))}
          color={PrimeColor.raspberry}
          fill={PrimeColor.white}
        />
      {/if}
      // if BaseFunction(2) is not 0, then add a closed point at (2, 0), and open points at (2, BaseFunction(2))
      and (2, -BaseFunction(2))
      {#if BaseFunction(2) !== 0}
        <Point2D
          position={new Vector2(xStart + 4, BaseFunction(2))}
          color={PrimeColor.raspberry}
          fill={PrimeColor.raspberry}
        />

        <Point2D
          position={new Vector2(xStart, -BaseFunction(2))}
          color={PrimeColor.raspberry}
          fill={PrimeColor.white}
        />
      {/if}
    {/each}
  {/if}
  {#if controls[3]}
    {#each periodStarts as xStart (xStart)}
      <ExplicitFunction2D
        func={(x: number) => EvenBaseFunction(MoveX(x))}
        xMin={xStart}
        xMax={xStart + 4}
        color={PrimeColor.darkGreen}
      />
    {/each}
  {/if}
  {#if controls[1]}
    <ExplicitFunction2D
      func={BaseFunction}
      color={PrimeColor.yellow}
      xMin={0}
      xMax={2}
      isDashed={true}
    />
    <Point2D
      position={new Vector2(0, BaseFunction(0))}
      color={PrimeColor.yellow}
      fill={PrimeColor.yellow}
    />
    <Point2D
      position={new Vector2(2, BaseFunction(2))}
      color={PrimeColor.yellow}
      fill={PrimeColor.yellow}
    />
  {/if}
</Canvas2D>
