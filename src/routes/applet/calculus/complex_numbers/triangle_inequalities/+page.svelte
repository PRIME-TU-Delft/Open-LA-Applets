<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import PolarGrid from '$lib/d3/PolarGrid.svelte';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;
  let axisP: AxisProps | undefined;

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
    new Vector2(-1, -3), // bottom-left
    new Vector2(8, 4), // top-right
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
  axisP = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0,
    showGridLinesX: false,
    showGridLinesY: false
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
  xAxisLabel = '\\operatorname{Re}';
  yAxisLabel = '\\operatorname{Im}';

  function SnapToGrid(position: Vector2): Vector2 {
    let snappedX = Number(position.x.toFixed(1));
    let snappedY = Number(position.y.toFixed(1));
    if (snappedX === 0 && snappedY === 0) {
      snappedX = 0.1 * Math.sign(position.x);
      snappedY = 0.1 * Math.sign(position.y);
    }
    return new Vector2(snappedX, snappedY);
  }
  const Rez = 3;
  const Imz = 1;
  const Rew = 1;
  const Imw = 2;
  const draggablePoint = [
    new Draggable(new Vector2(Rez, Imz), PrimeColor.orange, undefined, SnapToGrid),
    new Draggable(new Vector2(Rew, Imw), PrimeColor.blue, undefined, SnapToGrid)
  ];
  const formulas = $derived.by(() => {
    function getStr(position: Vector2): string {
      const Re = position.x;
      const Im = position.y;
      const ModSquared = Re ** 2 + Im ** 2;
      const NInSqrtRoot = ModSquared * 100;
      let str = '0.1\\sqrt{' + NInSqrtRoot.toFixed(0) + '}';
      return str;
    }
    const Sum = draggablePoint[0].position.clone().add(draggablePoint[1].position);
    const SumMoreVector = new Vector2(
      0,
      draggablePoint[0].position.length() + draggablePoint[1].position.length()
    );
    const Difference = draggablePoint[0].position.clone().sub(draggablePoint[1].position);
    const DifferenceLessVector = new Vector2(
      draggablePoint[0].position.length() - draggablePoint[1].position.length()
    );
    const f1 = new Formula(
      '|z| &= ' + getStr(draggablePoint[0].position),
      undefined,
      undefined,
      PrimeColor.orange
    );
    const f2 = new Formula(
      '|w| &=' + getStr(draggablePoint[1].position),
      undefined,
      undefined,
      PrimeColor.blue
    );
    const f3 = new Formula('|z+w| &=' + getStr(Sum), undefined, undefined, PrimeColor.green);
    const f4 = new Formula(
      '|z|+|w| &=' + getStr(SumMoreVector),
      undefined,
      undefined,
      PrimeColor.darkGreen
    );
    const f5 = new Formula('|z-w| &=' + getStr(Difference), undefined, undefined, PrimeColor.pink);
    const f6 = new Formula(
      '||z|-|w|| &=' + getStr(DifferenceLessVector),
      undefined,
      undefined,
      PrimeColor.purple
    );
    return new Formulas(f1, f2, f3, f4, f5, f6).align();
  });

  const toggleControls = Controls.addToggle(
    false,
    toLatexText('Cartesian grid'),
    PrimeColor.black,
    {
      isSwitch: true,
      switchRightSide: toLatexText('Polar grid')
    }
  );
</script>

<Canvas2D
  controls={toggleControls}
  draggables={draggablePoint}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={toggleControls[0] ? axisP : axis}
  {scaleX}
  {scaleY}
  {formulas}
  showFormulasDefault={true}
>
  {#if toggleControls[0]}
    <PolarGrid showAngleTicks showRadiiTicks={false} />
  {/if}
  <Latex2D
    latex="z"
    position={draggablePoint[0].position}
    color={PrimeColor.orange}
    alignX="center"
    alignY="bottom"
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
    offset={new Vector2(0, -0.25)}
  />
  <Latex2D
    latex="w"
    position={draggablePoint[1].position}
    color={PrimeColor.blue}
    alignX="center"
    alignY="bottom"
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
    offset={new Vector2(0, 0.25)}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[0].position}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={draggablePoint[1].position}
    end={draggablePoint[0].position.clone().add(draggablePoint[1].position)}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[1].position}
    color={PrimeColor.blue}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    color={PrimeColor.blue}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    color={PrimeColor.green}
    radius={0.08}
  />
  <Point2D
    position={draggablePoint[0].position.clone().sub(draggablePoint[1].position)}
    color={PrimeColor.pink}
    radius={0.08}
  />
  <Latex2D
    latex="z+w"
    color={PrimeColor.green}
    position={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    alignX="left"
    alignY="bottom"
    offset={new Vector2(0.1, 0.1)}
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
  />
  <Latex2D
    latex="z-w"
    color={PrimeColor.pink}
    position={draggablePoint[0].position.clone().sub(draggablePoint[1].position)}
    alignX="left"
    alignY="top"
    offset={new Vector2(0.1, -0.1)}
    background={PrimeColor.white + PrimeColor.opacity(0.9)}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[1].position.clone().add(draggablePoint[0].position)}
    color={PrimeColor.green}
    width={0.05}
  />
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[0].position.clone().sub(draggablePoint[1].position)}
    color={PrimeColor.pink}
    width={0.05}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={draggablePoint[1].position}
    color={PrimeColor.pink}
    width={0.05}
    isDashed={true}
  />
</Canvas2D>
