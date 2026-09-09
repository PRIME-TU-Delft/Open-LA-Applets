<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import VectorField2D from '$lib/d3/VectorField2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { solveInitialValueProblem } from '$lib/utils/MathLib';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';

  let initialViewBox: ViewBox | undefined;
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

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 2;
  let scaleY = 2;

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3 / scaleX, -7 / scaleY), // bottom-left
    new Vector2(4 / scaleX, 7 / scaleY), // top-right
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
    skipX: 1,
    skipY: 1
  };

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 't';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  function SnapToGrid(position: Vector2): Vector2 {
    const gridSize = 0.1; // must match the step of listY0 so every snapped y has a matching solution
    const snappedX = 0; // Snap x-coordinate to 0
    const snappedY = Math.max(-2, Math.min(Math.round(position.y / gridSize) * gridSize, 3));
    return new Vector2(snappedX, snappedY);
  }
  const x0 = 0;
  const y0 = 0;
  const draggablePoint = [
    new Draggable(new Vector2(x0, y0), PrimeColor.orange, undefined, SnapToGrid)
  ];

  const listY0 = Array.from({ length: 61 }, (_, i) => -2 + i * 0.1); // from -2 to 3, with step 0.1
  let NumericalSolutions: { solution: (t: number) => number; tRange: [number, number] }[] = [];
  listY0.forEach((Y0) => {
    NumericalSolutions.push(
      solveInitialValueProblem(
        (x: number, y: number) => (y + 1) * (y - 2) * (y + x - 1),
        x0,
        Y0,
        [-30 / scaleX, 30 / scaleX],
        [-30 / scaleY, 30 / scaleY]
      )
    );
  });
  const toggleControls = Controls.addToggle(
    false,
    toLatexText('Hide equilibria'),
    PrimeColor.black,
    {
      isSwitch: true,
      switchRightSide: toLatexText('Show equilibria')
    }
  );
</script>

<Canvas2D
  controls={toggleControls}
  draggables={draggablePoint}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const initY = draggablePoint[0].position.y}
  {@const initYIndex = listY0.findIndex((y) => Math.abs(y - initY) < 1e-6)}
  <VectorField2D
    f={(x: number, y: number) => new Vector2(1, (y + 1) * (y - 2) * (y + x - 1))}
    color={PrimeColor.blue}
    step={0.25}
    normalizedLength={0.2}
    hideHead={true}
  />
  <ExplicitFunction2D
    func={(t: number) => NumericalSolutions[initYIndex].solution(t)}
    xMin={NumericalSolutions[initYIndex].tRange[0]}
    xMax={NumericalSolutions[initYIndex].tRange[1]}
    color={PrimeColor.green}
    width={0.08}
  />
  {#if toggleControls[0]}
    <ExplicitFunction2D
      func={(_t: number) => -1}
      xMin={-30 / scaleX}
      xMax={30 / scaleX}
      color={PrimeColor.orange}
      width={0.08}
    />
    <ExplicitFunction2D
      func={(_t: number) => 2}
      xMin={-30 / scaleX}
      xMax={30 / scaleX}
      color={PrimeColor.purple}
      width={0.08}
    />
  {/if}
</Canvas2D>
