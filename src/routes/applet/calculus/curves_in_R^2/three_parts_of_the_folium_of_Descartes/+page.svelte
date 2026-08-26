<script lang="ts">
  // For ease of creating the template applets
  import {
    AppletObject,
    ImplicitFunctionFragment,
    ParameterizedFunctionFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { projectToImplicitFunction2D } from '$lib/utils/MathLib';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { ViewBox } from '$lib/d3/ViewBox';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';

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
  const tSwitch = Math.pow(2, -1 / 3);
  const xSwitch = paramX(tSwitch);
  const ySwitch = paramY(tSwitch);
  function zeroEquation(x: number, y: number): number {
    return x ** 3 + y ** 3 - 3 * x * y;
  }
  function paramX(t: number): number {
    return (3 * t) / (1 + t ** 3);
  }
  function paramY(t: number): number {
    return (3 * t ** 2) / (1 + t ** 3);
  }
  const appletObjects: AppletObject[] = [
    new ImplicitFunctionFragment(zeroEquation, PrimeColor.blue, {
      legendText: 'x^3 + y^3 = 3xy',
      maxDepth: 3,
      width: 0.08,
      range: { yMin: 0 },
      domain: { xMax: 0 }
    }),
    new ParameterizedFunctionFragment(paramX, paramY, PrimeColor.blue, {
      width: 0.08,
      tStart: 0,
      tEnd: Math.pow(2, -1 / 3)
    }),
    new ParameterizedFunctionFragment(paramX, paramY, PrimeColor.darkGreen, {
      width: 0.08,
      tStart: Math.pow(2, -1 / 3),
      tEnd: 10000
    }),
    new ImplicitFunctionFragment(zeroEquation, PrimeColor.orange, {
      maxDepth: 3,
      width: 0.08,
      range: { yMax: 0 },
      domain: { xMin: 0 }
    }),
    new ParameterizedFunctionFragment(paramX, paramY, PrimeColor.blue, {
      width: 0.08,
      tStart: 0,
      tEnd: 0
    }).addIncludedPoints(new Vector2(xSwitch, ySwitch)),
    new ParameterizedFunctionFragment(paramX, paramY, PrimeColor.darkGreen, {
      width: 0.08,
      tStart: Math.pow(2, -1 / 3),
      tEnd: Math.pow(2, -1 / 3)
    })
      .addGaps(new Vector2(xSwitch, ySwitch))
      .addIncludedPoints(new Vector2(0, 0)),
    new ImplicitFunctionFragment(zeroEquation, PrimeColor.orange, {
      maxDepth: 3,
      width: 0.08,
      range: { yMax: 0, yMin: 0 },
      domain: { xMin: 0, xMax: 0 }
    }).addGaps(new Vector2(0, 0))
  ];
  const initX = Math.pow(2, 1 / 3);
  const initY = Math.pow(4, 1 / 3);
  const draggables = [
    new Draggable(
      new Vector2(initX, initY),
      PrimeColor.raspberry,
      undefined,
      snapFolium,
      undefined,
      undefined,
      0
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
  function getColor(pos: Vector2): string {
    // We project to the nearest point on the folium of Descartes, which is defined by the equation x^3 + y^3 = 3xy.
    // Because the initial distance can be large, first use a very course projection to get close to the curve,
    // then use a finer projection to get closer.
    let coarseX = pos.x;
    let coarseY = pos.y;
    if (coarseX < 0 && coarseY > 0) {
      return PrimeColor.blue;
    }
    if (coarseX > 0 && coarseY < 0) {
      return PrimeColor.orange;
    }
    if (coarseX > 0 && coarseY > 0) {
      if (coarseY > ySwitch + (ySwitch / xSwitch) * (coarseX - xSwitch)) {
        return PrimeColor.darkGreen;
      }
      return PrimeColor.blue;
    }
    return PrimeColor.darkGreen;
  }

  const formulas = $derived.by(() => {
    let x = draggables[0].position.x;
    let y = draggables[0].position.y;
    let formulaX = new Formula('x&\\approx' + (x < 0 ? '' : '\\phantom{-}') + '\\$1').addAutoParam(
      x.toFixed(4).replace(/(\.?0+)$/, '\\phantom{$1}'),
      getColor(draggables[0].position)
    );
    let formulaY = new Formula('y&\\approx' + (y < 0 ? '' : '\\phantom{-}') + '\\$1').addAutoParam(
      y.toFixed(4).replace(/(\.?0+)$/, '\\phantom{$1}'),
      getColor(draggables[0].position)
    );
    return new Formulas(formulaX, formulaY).align();
  });
</script>

<CanvasGrid
  columns={2}
  rows={2}
  {formulas}
   legendFormulaPosition="center"
>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    {draggables}
  >
    <TemplateComponent objects={[appletObjects[0], appletObjects[1], appletObjects[4]]} />
    {#if getColor(draggables[0].position) === PrimeColor.blue}
      <Point2D
        position={draggables[0].position}
        radius={0.15}
        pulse={true}
        color={PrimeColor.blue}
      />
    {/if}
  </GridCanvas2D>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    {draggables}
  >
    <TemplateComponent objects={[appletObjects[2], appletObjects[5]]} />
    {#if getColor(draggables[0].position) === PrimeColor.darkGreen}
      <Point2D
        position={draggables[0].position}
        radius={0.15}
        pulse={true}
        color={PrimeColor.darkGreen}
      />
    {/if}
  </GridCanvas2D>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    {draggables}
  >
    <TemplateComponent objects={[appletObjects[3], appletObjects[6]]} />
    {#if getColor(draggables[0].position) === PrimeColor.orange}
      <Point2D
        position={draggables[0].position}
        radius={0.15}
        pulse={true}
        color={PrimeColor.orange}
      />
    {/if}
  </GridCanvas2D>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    {draggables}
  >
    <TemplateComponent
      objects={[appletObjects[0], appletObjects[1], appletObjects[2], appletObjects[3]]}
    />
    <Point2D
      position={draggables[0].position}
      radius={0.15}
      pulse={true}
      color={getColor(draggables[0].position)}
    />
  </GridCanvas2D>
</CanvasGrid>
