<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import PolarGrid from '$lib/d3/PolarGrid.svelte';
  import { LegendItem } from '$lib/utils/Legend';

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
    new Vector2(-5, -5), // bottom-left
    new Vector2(5, 5), // top-right
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

  const ThetaRadius = 4;
  function SnapToGrid(position: Vector2): Vector2 {
    const theta = Math.atan2(position.y, position.x);
    let thetaOverPi = theta / Math.PI;
    thetaOverPi = Number(thetaOverPi.toFixed(2));
    if (thetaOverPi === 0) {
      thetaOverPi = 0.01 * Math.sign(theta);
    }
    if (thetaOverPi < 0) {
      thetaOverPi += 2;
    }
    const snappedX = ThetaRadius * Math.cos(thetaOverPi * Math.PI);
    const snappedY = ThetaRadius * Math.sin(thetaOverPi * Math.PI);
    return new Vector2(snappedX, snappedY);
  }
  const InitTheta = 0.8 * Math.PI;
  const Rez = ThetaRadius * Math.cos(InitTheta);
  const Imz = ThetaRadius * Math.sin(InitTheta);
  const draggablePoint = [
    new Draggable(new Vector2(Rez, Imz), PrimeColor.orange, undefined, SnapToGrid)
  ];
  const formulas = $derived.by(() => {
    const re = draggablePoint[0].position.x;
    const im = draggablePoint[0].position.y;
    const theta = Math.atan2(im, re);
    let thetaOverPi = theta / Math.PI;
    thetaOverPi = Number(thetaOverPi.toFixed(2));
    if (thetaOverPi < 0) {
      thetaOverPi += 2;
    }

    const f1 = new Formula(
      '\\theta &= ' + thetaOverPi.toFixed(2) + '\\pi',
      undefined,
      undefined,
      PrimeColor.orange
    );
    return new Formulas(f1).align();
  });

  const fixDisplayIssueWithSlider = 1000;
  const controls = Controls.addSlider(0.01, 0.001, 0.2, 0.001, PrimeColor.pink, {
    label: toLatexText('$n=$'),
    valueFn: (v: number) => toLatexText((v * fixDisplayIssueWithSlider).toFixed(0)),
    animationStep: 0.001
  }).addToggle(true, toLatexText('Cartesian grid'), PrimeColor.black, {
    isSwitch: true,
    switchRightSide: toLatexText('Polar grid')
  });

  const n = $derived(Number((controls[0] * fixDisplayIssueWithSlider).toFixed(0)));

  const theta = $derived.by(() => {
    const thetaTemp = Math.atan2(draggablePoint[0].position.y, draggablePoint[0].position.x);
    let thetaOverPi = thetaTemp / Math.PI;
    thetaOverPi = Number(thetaOverPi.toFixed(2));
    if (thetaOverPi === 0) {
      thetaOverPi = 0.01 * Math.sign(theta);
    }
    if (thetaOverPi < 0) {
      thetaOverPi += 2;
    }
    return thetaOverPi * Math.PI;
  });

  function ThetaFunc(val: number): string {
    let OverPi = val / Math.PI;
    OverPi = Number(OverPi.toFixed(2));
    if (OverPi < 0) {
      OverPi += 2;
    }
    return OverPi.toFixed(2);
  }

  const argZn = $derived(Math.atan(theta / n));
  const modZn = $derived(Math.pow(Math.sqrt(1 + theta ** 2 / n ** 2), n));
</script>

<Canvas2D
  {controls}
  draggables={draggablePoint}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  axis={controls[1] ? axisP : axis}
  {scaleX}
  {scaleY}
  {formulas}
  showFormulasDefault={true}
  legendItems={[
    new LegendItem(toLatexText('$1+\\$1\\pi i$'), PrimeColor.blue, 'square').addAutoParam(
      ThetaFunc(theta),
      PrimeColor.orange
    ),
    new LegendItem(
      toLatexText('$\\left\\{\\left(1+\\dfrac{\\$1\\pi}{k} i\\right)^{k}\\right\\}_{k=1}^{\\$2}$'),
      PrimeColor.cyan,
      'circle'
    )
      .addAutoParam(ThetaFunc(theta), PrimeColor.orange)
      .addAutoParam(n, PrimeColor.pink)
  ]}
>
  {#if controls[1]}
    <PolarGrid showAngleTicks showRadiiTicks={false} />
  {/if}
  <Line2D
    start={new Vector2(0, 0)}
    end={draggablePoint[0].position.clone().multiplyScalar(2 * Math.sqrt(30))}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Point2D position={new Vector2(1, theta)} color={PrimeColor.blue} radius={0.08} shape="square" />

  {#each Array(n) as _, k (k)}
    {#if k > 0}
      {@const lastArg = k * Math.atan(theta / k)}
      {@const lastMod = Math.pow(Math.sqrt(1 + theta ** 2 / k ** 2), k)}
      {@const currentArg = (k + 1) * Math.atan(theta / (k + 1))}
      {@const currentMod = Math.pow(Math.sqrt(1 + theta ** 2 / (k + 1) ** 2), k + 1)}
      {@const currentColor = PrimeColor.cyan}
      <Line2D
        end={new Vector2(lastMod * Math.cos(lastArg), lastMod * Math.sin(lastArg))}
        start={new Vector2(currentMod * Math.cos(currentArg), currentMod * Math.sin(currentArg))}
        color={currentColor}
        isDashed={true}
        width={0.05 / k}
      />
      <Point2D
        position={new Vector2(currentMod * Math.cos(currentArg), currentMod * Math.sin(currentArg))}
        color={currentColor}
        radius={0.1 / k}
      />
    {/if}
  {/each}
</Canvas2D>
