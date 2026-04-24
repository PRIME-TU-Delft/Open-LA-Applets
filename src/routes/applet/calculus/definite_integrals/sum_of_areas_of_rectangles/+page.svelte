<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unused-vars */ // For ease of creating the template applets
  import {
    AppletObject,
    AsymptoteFragment,
    FunctionFragment,
    ObliqueAsymptoteFragment
  } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Axis from '$lib/d3/Axis.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { toLatexText } from '$lib/utils/FormatString';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import { midpoint } from '@cortex-js/compute-engine/interval';
  import Latex from '$lib/components/Latex.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let cameraPosition: Vector2 | undefined;
  let cameraZoom: number | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;

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
    new Vector2(-1, -2), // bottom-left
    new Vector2(6, 5), // top-right
    0.5 // margin
  );

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  let N = 9;
  let pick = N - 4;
  let a = 0.75;
  let b = 5.8;

  const func = (x: number): number => {
    return (-2 / 7) * x ** 3 + 3 * x ** 2 - (135 / 14) * x + 153 / 14 + 0.5;
  };

  let leftPoints = [];
  let rightPoints = [];
  let midPoints = [];

  for (let i = 0; i <= N - 1; i++) {
    leftPoints.push(a + i * ((b - a) / N));
    rightPoints.push(a + (i + 1) * ((b - a) / N));
    midPoints.push(a + (i + 0.5) * ((b - a) / N));
  }

  // ##############
  // APPLET OBJECTS
  // ##############
  const appletObjects: AppletObject[] = [
    new FunctionFragment(func, PrimeColor.blue, {
      legendText: 'f(x)'
    })
  ];
  for (let i = 0; i <= N - 1; i++) {
    appletObjects.push(
      new FunctionFragment((x: number) => func(midPoints[i]), PrimeColor.darkGreen, {
        domain: { xMin: leftPoints[i], xMax: rightPoints[i] },
        integral: {
          xLeft: leftPoints[i],
          xRight: rightPoints[i]
        }
      })
    );
    appletObjects.push(
      new FunctionFragment((x: number) => 0, PrimeColor.darkGreen, {
        domain: { xMin: leftPoints[i], xMax: rightPoints[i] },
        integral: {
          xLeft: leftPoints[i],
          xRight: rightPoints[i]
        }
      })
    );
  }
</script>

<Canvas2D
  {initialViewBox}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={null}
>
  <Axis
    showAxisNumbersX={false}
    showAxisNumbersY={false}
    showGridLinesX={false}
    showGridLinesY={false}
    skipX={100}
    skipY={100}
    additionalTicksX={[a, b, midPoints[pick]]}
  />
  <Line2D
    start={new Vector2(leftPoints[pick], func(midPoints[pick]))}
    end={new Vector2(leftPoints[pick], func(midPoints[pick]) + 1)}
    isDashed={true}
  />
  <Line2D
    start={new Vector2(rightPoints[pick], func(midPoints[pick]))}
    end={new Vector2(rightPoints[pick], func(midPoints[pick]) + 1)}
    isDashed={true}
  />
  <Vector2D
    origin={new Vector2(leftPoints[pick], func(midPoints[pick]) + 0.85)}
    direction={new Vector2(1, 0)}
    length={(b - a) / N}
    radius={0.01}
    color={PrimeColor.black}
    headLength={0.1}
  />
  <Vector2D
    origin={new Vector2(rightPoints[pick], func(midPoints[pick]) + 0.85)}
    direction={new Vector2(-1, 0)}
    length={(b - a) / N}
    radius={0.01}
    color={PrimeColor.black}
    headLength={0.1}
  />
  <Latex2D
    latex={'\\Delta x_{i}'}
    position={new Vector2(midPoints[pick], func(midPoints[pick]) + 1)}
    alignX="center"
    alignY="bottom"
  />
  <Latex2D latex={'a'} position={new Vector2(a, -0.15)} alignX="center" />
  <Latex2D latex={'b'} position={new Vector2(b, -0.15)} alignX="center" />
  {#each leftPoints as obj, i}
    <Line2D
      start={new Vector2(obj, 0)}
      end={new Vector2(obj, func(midPoints[i]))}
      color={PrimeColor.darkGreen}
    />
    <Line2D
      start={new Vector2(rightPoints[i], 0)}
      end={new Vector2(rightPoints[i], func(midPoints[i]))}
      color={PrimeColor.darkGreen}
    />
  {/each}
  <Line2D
    start={new Vector2(midPoints[pick], 0)}
    end={new Vector2(midPoints[pick], func(midPoints[pick]))}
    color={PrimeColor.raspberry}
    isDashed={true}
  />
  <Latex2D latex={'x_{i}^{*}'} position={new Vector2(midPoints[pick], -0.15)} alignX="center" />
  <TemplateComponent objects={appletObjects} />
</Canvas2D>
