<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, ImplicitFunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import { projectToImplicitFunction2D } from '$lib/utils/MathLib';
  import { ViewBox } from '$lib/d3/ViewBox';

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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-4, -4), // bottom-left
    new Vector2(4, 4), // top-right
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
  const zeroEquation = (x: number, y: number) => x ** 3 + y ** 3 - 3 * x * y;
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment(zeroEquation, PrimeColor.blue, {
      legendText: 'x^3 + y^3 = 3xy',
      maxDepth: 3,
      width: 0.08
    })
  ];
  const initX = Math.pow(2, 1 / 3);
  const initY = Math.pow(4, 1 / 3);
  const draggables = [
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.orange,
      undefined,
      snapFolium,
      undefined,
      undefined,
      0.12
    )
  ];
  function snapFolium(pos: Vector2): Vector2 {
    // We project to the nearest point on the folium of Descartes, which is defined by the equation x^3 + y^3 = 3xy.
    // Because the initial distance can be large, first use a very course projection to get close to the curve,
    // then use a finer projection to get closer.
    let coarseX = pos.x;
    let coarseY = pos.y;
    let angle = Math.atan2(coarseY, coarseX);
    while (angle < -Math.PI / 8) {
      angle += 2 * Math.PI;
    }
    while (angle > (15 * Math.PI) / 8) {
      angle -= 2 * Math.PI;
    }
    if (angle < (5 * Math.PI) / 8) {
      // in loop part, so project to first quadrant first
      if (coarseX < 0) {
        coarseX = 0;
      }
      if (coarseY < 0) {
        coarseY = 0;
      }
      // then project on tight circle around origin, to avoid going too far away from the curve
      const radiusSquared = coarseX ** 2 + coarseY ** 2;
      angle = Math.atan2(coarseY, coarseX);
      if (radiusSquared > 4.5) {
        coarseX = Math.sqrt(4.5) * Math.cos(angle);
        coarseY = Math.sqrt(4.5) * Math.sin(angle);
      }
    } else if (angle < (5 * Math.PI) / 4) {
      // in left part, so project to line near curve
      if (coarseY < 0) {
        coarseY = 0;
      }
    } else {
      // in bottom part, so project to line near curve
      if (coarseX < 0) {
        coarseX = 0;
      }
    }
    const coarse = new Vector2(coarseX, coarseY);
    const projected = projectToImplicitFunction2D(zeroEquation, coarse);
    return projected;
  }
</script>

<Canvas2D
  {draggables}
  {initialViewBox}
  legendItems={[
    ...getLegend(appletObjects),
    new LegendItem('\\text{Tangent line}', PrimeColor.darkGreen)
  ]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  {@const x = draggables[0].position.x}
  {@const y = draggables[0].position.y}
  <TemplateComponent objects={appletObjects} />
  // Avoid origin
  {#if x !== 0 && y !== 0}
    // Avoid vertical tangent line
    {#if 3 * y ** 2 - 3 * x !== 0}
      {@const dydx = (3 * y - 3 * x ** 2) / (3 * y ** 2 - 3 * x)}
      <InfiniteLine2D
        origin={new Vector2(x, y)}
        direction={new Vector2(1, dydx)}
        color={PrimeColor.darkGreen}
        width={0.08}
      />
    {/if}
    {#if 3 * y ** 2 - 3 * x === 0}
      <InfiniteLine2D
        origin={new Vector2(x, y)}
        direction={new Vector2(0, 1)}
        color={PrimeColor.darkGreen}
        width={0.08}
      />
    {/if}
  {/if}
</Canvas2D>
