<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';

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
  cameraPosition = new Vector2(3, 0.5);
  cameraZoom = 1.0;

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

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############

  const period = (4 * Math.PI) / 3; // Fundamental period of the function
  function FundamentalPeriod(x: number): number {
    const xmin = -2.5;
    const xmax = 4.5;
    const ymin = -0.8;
    const ymax = 1.5;
    const z = (xmax - xmin) / (3 * (ymax - ymin));
    const xscale = (2 * Math.PI) / period;
    return z * (Math.tanh(3 * Math.sin(x * xscale)) - Math.sin(x * xscale + 0.5) + 0.5) * 2.5;
  }
  const appletObjects: AppletObject[] = [new FunctionFragment(FundamentalPeriod, PrimeColor.blue)];

  const xStart = 1.2 - period; // Starting x-coordinate for the draggable points
  function snapFunction(Vector: Vector2): Vector2 {
    const x = Vector.x;
    const y = FundamentalPeriod(x);
    return new Vector2(x, y);
  }
  const draggables = [
    new Draggable(
      new Vector2(xStart, FundamentalPeriod(xStart)),
      PrimeColor.darkGreen,
      undefined,
      snapFunction
    ),
    new Draggable(
      new Vector2(xStart + period, FundamentalPeriod(xStart)),
      PrimeColor.darkGreen,
      undefined,
      snapFunction
    ),
    new Draggable(
      new Vector2(xStart + 2 * period, FundamentalPeriod(xStart)),
      PrimeColor.darkGreen,
      undefined,
      snapFunction
    )
  ];

  // Track previous positions
  let prevX0 = xStart;
  let prevX1 = xStart + period;
  let prevX2 = xStart + 2 * period;

  // Derived values for each draggable's x position
  const x0 = $derived(draggables[0].position.x);
  const x1 = $derived(draggables[1].position.x);
  const x2 = $derived(draggables[2].position.x);

  $effect(() => {
    // Find which draggable moved the most
    const delta0 = Math.abs(x0 - prevX0);
    const delta1 = Math.abs(x1 - prevX1);
    const delta2 = Math.abs(x2 - prevX2);

    const threshold = 0.01;

    // Only update if there's a meaningful change
    if (delta0 > threshold || delta1 > threshold || delta2 > threshold) {
      if (delta0 >= delta1 && delta0 >= delta2) {
        // Draggable 0 moved most, sync 1 and 2
        draggables[1].position = new Vector2(x0 + period, FundamentalPeriod(x0 + period));
        draggables[2].position = new Vector2(x0 + 2 * period, FundamentalPeriod(x0 + 2 * period));
      } else if (delta1 >= delta0 && delta1 >= delta2) {
        // Draggable 1 moved most, sync 0 and 2
        draggables[0].position = new Vector2(x1 - period, FundamentalPeriod(x1 - period));
        draggables[2].position = new Vector2(x1 + period, FundamentalPeriod(x1 + period));
      } else {
        // Draggable 2 moved most, sync 0 and 1
        draggables[0].position = new Vector2(x2 - 2 * period, FundamentalPeriod(x2 - 2 * period));
        draggables[1].position = new Vector2(x2 - period, FundamentalPeriod(x2 - period));
      }

      prevX0 = x0;
      prevX1 = x1;
      prevX2 = x2;
    }
  });

  let scaleX = 1;
  let scaleY = 1;
</script>

<Canvas2D
  {draggables}
  {cameraPosition}
  {cameraZoom}
  legendItems={getLegend(appletObjects)}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <TemplateComponent objects={appletObjects} />
  <Line2D
    color={PrimeColor.darkGreen}
    start={new Vector2(draggables[0].position.x, -2.5)}
    end={new Vector2(draggables[0].position.x, FundamentalPeriod(draggables[0].position.x))}
    isDashed={true}
  />
  <Line2D
    color={PrimeColor.darkGreen}
    start={new Vector2(draggables[0].position.x + period, -1.75)}
    end={new Vector2(
      draggables[0].position.x + period,
      FundamentalPeriod(draggables[0].position.x + period)
    )}
    isDashed={true}
  />
  <Line2D
    color={PrimeColor.darkGreen}
    start={new Vector2(draggables[0].position.x + 2 * period, -2.5)}
    end={new Vector2(
      draggables[0].position.x + 2 * period,
      FundamentalPeriod(draggables[0].position.x + 2 * period)
    )}
    isDashed={true}
  />
  <Vector2D
    color={PrimeColor.darkGreen}
    origin={new Vector2(draggables[0].position.x + period / 2, -1.5)}
    direction={new Vector2(1, 0)}
    length={period / 2}
  />
  <Vector2D
    color={PrimeColor.darkGreen}
    origin={new Vector2(draggables[0].position.x + period / 2 + 0.1, -1.5)}
    direction={new Vector2(-1, 0)}
    length={period / 2 + 0.1}
  />
  <Vector2D
    color={PrimeColor.darkGreen}
    origin={new Vector2(draggables[0].position.x + period / 2, -2.25)}
    direction={new Vector2(1, 0)}
    length={(3 * period) / 2}
  />
  <Vector2D
    color={PrimeColor.darkGreen}
    origin={new Vector2(draggables[0].position.x + period / 2 + 0.1, -2.25)}
    direction={new Vector2(-1, 0)}
    length={period / 2 + 0.1}
  />
  <Latex2D
    color={PrimeColor.darkGreen}
    position={new Vector2(draggables[0].position.x + period / 2, -1.5)}
    latex="T"
    alignX="center"
    alignY="top"
  />
  <Latex2D
    color={PrimeColor.darkGreen}
    position={new Vector2(draggables[0].position.x + period, -2.25)}
    latex="2T"
    alignX="center"
    alignY="top"
  />
</Canvas2D>
