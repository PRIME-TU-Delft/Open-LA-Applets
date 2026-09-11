<script lang="ts">
  // For ease of creating the template applets
  import { AppletObject, FunctionFragment } from '$lib/template/TemplateAppletObjects';
  import TemplateComponent from '$lib/template/TemplateComponent.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getLegend } from '$lib/template/ObjectFormulas';
  import { withSign } from '$lib/utils/FormatString';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import CanvasGrid from '$lib/common/CanvasGrid.svelte';
  import GridCanvas2D from '$lib/common/GridCanvas2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import { ViewBox } from '$lib/d3/ViewBox';

  let initialViewBox: ViewBox | undefined;
  let initialViewBox2: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;
  let axis2: AxisProps | undefined;

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
    new Vector2(-5, -7), // bottom-left
    new Vector2(5, 7), // top-right
    0 // margin
  );
  initialViewBox2 = new ViewBox(
    new Vector2(-1, -1), // bottom-left
    new Vector2(1, 1), // top-right
    0 // margin
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
  axis2 = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 1,
    skipY: 0,
    colorX: PrimeColor.raspberry,
    colorY: PrimeColor.yellow
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
  const Sol1 = (x: number) => Math.exp(3 * x);
  const Sol2 = (x: number) => x * Math.exp(3 * x);
  const appletObjects: AppletObject[] = [
    new FunctionFragment(Sol1, PrimeColor.blue, {
      legendText: 'y_1(t)=e^{3t}',
      width: 0.1
    }),
    new FunctionFragment(Sol2, PrimeColor.orange, {
      legendText: 'y_2(t)=te^{3t}',
      width: 0.1
    })
  ];
  const draggables = [
    new Draggable(
      new Vector2(-0.2, 0.1),
      PrimeColor.darkGreen,
      undefined,
      SnapToGrid,
      undefined,
      undefined,
      0.2
    )
  ];
  function SnapToGrid(position: Vector2): Vector2 {
    const snappedX = Number(position.x.toFixed(1));
    const snappedY = Number(position.y.toFixed(1));
    return new Vector2(snappedX, snappedY);
  }
  const legendSum = $derived.by(() => {
    const c1 = draggables[0].position.x;
    const c2 = draggables[0].position.y;
    return new LegendItem('y(t)=\\$1y_1(t)\\$2y_2(t)', PrimeColor.darkGreen)
      .addAutoParam(c1.toFixed(1).replace('.0', ''), PrimeColor.raspberry)
      .addAutoParam(withSign(c2, 1).replace('.0', ''), PrimeColor.yellow);
  });
</script>

<CanvasGrid rows={3} columns={2} legendItems={[...getLegend(appletObjects), legendSum]}>
  <GridCanvas2D
    {initialViewBox}
    labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
    {axis}
    {scaleX}
    {scaleY}
    gridColumn="1"
    gridRow="1 / span 3"
  >
    {@const c1 = draggables[0].position.x}
    {@const c2 = draggables[0].position.y}
    <TemplateComponent objects={appletObjects} />
    <ExplicitFunction2D
      func={(t: number) => c1 * Sol1(t) + c2 * Sol2(t)}
      color={PrimeColor.darkGreen}
      width={0.1}
    />
  </GridCanvas2D>
  <GridCanvas2D
    {draggables}
    initialViewBox={initialViewBox2}
    labels={{ xLabel: 'c_1', yLabel: 'c_2' }}
    axis={axis2}
    scaleX={5}
    scaleY={5}
    gridColumn="2"
    gridRow="2 / span 2"
  ></GridCanvas2D>
</CanvasGrid>
