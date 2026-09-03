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
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import PolarGrid from '$lib/d3/PolarGrid.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import Point2D from '$lib/d3/Point2D.svelte';

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

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -6), // bottom-left
    new Vector2(4, 5), // top-right
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
    const re = position.x;
    const im = position.y;
    const r = Math.sqrt(re * re + im * im);
    const theta = Math.atan2(im, re);
    const snappedR = Number(r.toFixed(1));
    const snappedTheta = Number((theta / Math.PI).toFixed(2)) * Math.PI;
    const snappedX = snappedR * Math.cos(snappedTheta);
    const snappedY = snappedR * Math.sin(snappedTheta);
    return new Vector2(snappedX, snappedY);
  }
  const r = 1.5;
  const theta = (1 / 5) * Math.PI;
  const re = r * Math.cos(theta);
  const im = r * Math.sin(theta);
  const s = 2;
  const phi = (3 / 5) * Math.PI;
  const sf = s * Math.cos(phi);
  const jn = s * Math.sin(phi);
  const draggablePoint = [
    new Draggable(new Vector2(re, im), PrimeColor.green, undefined, SnapToGrid),
    new Draggable(new Vector2(sf, jn), PrimeColor.cyan, undefined, SnapToGrid)
  ];
  const formulas = $derived.by(() => {
    const re = draggablePoint[0].position.x;
    const im = draggablePoint[0].position.y;
    const r = Math.sqrt(re * re + im * im);
    const theta = Math.atan2(im, re);
    const sf = draggablePoint[1].position.x;
    const jn = draggablePoint[1].position.y;
    const s = Math.sqrt(sf * sf + jn * jn);
    const phi = Math.atan2(jn, sf);
    const rs = r * s;
    const thetaphi = theta + phi;
    return new Formulas(
      new Formula('|z|&=' + r.toFixed(1).replace('.0', ''), undefined, undefined, PrimeColor.green),
      new Formula(
        '\\theta&=' +
          (theta / Math.PI)
            .toFixed(2)
            .replace('1.00', '')
            .replace(/\.?0+$/, '') +
          '\\pi',
        undefined,
        undefined,
        PrimeColor.darkGreen
      ),
      new Formula('|w|&=' + s.toFixed(1).replace('.0', ''), undefined, undefined, PrimeColor.cyan),
      new Formula(
        '\\phi&=' +
          (phi / Math.PI)
            .toFixed(2)
            .replace('1.00', '')
            .replace(/\.?0+$/, '') +
          '\\pi',
        undefined,
        undefined,
        PrimeColor.blue
      ),
      new Formula(
        '|zw|&=' + rs.toFixed(2).replace(/\.?0+$/, ''),
        undefined,
        undefined,
        PrimeColor.yellow
      ),
      new Formula(
        '\\theta+\\phi&=' +
          (thetaphi / Math.PI)
            .toFixed(2)
            .replace('1.00', '')
            .replace(/\.?0+$/, '') +
          '\\pi',
        undefined,
        undefined,
        PrimeColor.orange
      )
    ).align();
  });
  const toggleControls = Controls.addToggle(true, toLatexText('Cartesian grid'), PrimeColor.black, {
    isSwitch: true,
    switchRightSide: toLatexText('Polar grid')
  });
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
  {@const re = draggablePoint[0].position.x}
  {@const im = draggablePoint[0].position.y}
  {@const r = Math.sqrt(re * re + im * im)}
  {@const theta = Math.atan2(im, re)}
  <Latex2D
    latex="z"
    position={draggablePoint[0].position}
    color={PrimeColor.green}
    alignX={draggablePoint[0].position.x < 0 ? 'right' : 'left'}
    alignY={draggablePoint[0].position.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(
      draggablePoint[0].position.x < 0 ? -0.1 : 0.1,
      draggablePoint[0].position.y < 0 ? -0.1 : 0.1
    )}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, 0)}
    color={PrimeColor.green}
    width={0.05}
  />
  <Angle2D
    startAngle={0}
    endAngle={theta}
    hasHead={true}
    distance={0.9 * r}
    color={PrimeColor.darkGreen}
    width={0.05}
  />
  <Latex2D
    latex="\theta"
    color={PrimeColor.darkGreen}
    position={new Vector2(0.9 * r * Math.cos(theta / 2), 0.9 * r * Math.sin(theta / 2)).add(
      new Vector2(Math.cos(theta / 2), Math.sin(theta / 2)).multiplyScalar(0.3)
    )}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
  />
  <!-- w -->
  {@const sf = draggablePoint[1].position.x}
  {@const jn = draggablePoint[1].position.y}
  {@const s = Math.sqrt(sf * sf + jn * jn)}
  {@const phi = Math.atan2(jn, sf)}
  <Latex2D
    latex="w"
    position={draggablePoint[1].position}
    color={PrimeColor.cyan}
    alignX={draggablePoint[1].position.x < 0 ? 'right' : 'left'}
    alignY={draggablePoint[1].position.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(
      draggablePoint[1].position.x < 0 ? -0.1 : 0.1,
      draggablePoint[1].position.y < 0 ? -0.1 : 0.1
    )}
  />
  <Line2D
    start={draggablePoint[1].position}
    end={new Vector2(0, 0)}
    color={PrimeColor.cyan}
    width={0.05}
  />
  <Angle2D
    startAngle={0}
    endAngle={phi}
    hasHead={true}
    distance={0.9 * s}
    color={PrimeColor.blue}
    width={0.05}
  />
  <Latex2D
    latex="\phi"
    color={PrimeColor.blue}
    position={new Vector2(0.9 * s * Math.cos(phi / 2), 0.9 * s * Math.sin(phi / 2)).add(
      new Vector2(Math.cos(phi / 2), Math.sin(phi / 2)).multiplyScalar(0.3)
    )}
    alignX="center"
    alignY="center"
  />
  <!-- zw -->
  {@const rs = r * s}
  {@const thetaphi = theta + phi}
  {@const resf = rs * Math.cos(thetaphi)}
  {@const imjn = rs * Math.sin(thetaphi)}
  {@const product = new Vector2(resf, imjn)}
  <Point2D position={product} color={PrimeColor.yellow} />
  <Latex2D
    latex="zw"
    position={product}
    color={PrimeColor.yellow}
    alignX={product.x < 0 ? 'right' : 'left'}
    alignY={product.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(product.x < 0 ? -0.1 : 0.1, product.y < 0 ? -0.1 : 0.1)}
  />
  <Line2D start={product} end={new Vector2(0, 0)} color={PrimeColor.yellow} width={0.05} />
  <Angle2D
    startAngle={0}
    endAngle={thetaphi}
    hasHead={true}
    distance={0.9 * rs}
    color={PrimeColor.orange}
    width={0.05}
  />
  <Latex2D
    latex="\theta+\phi"
    color={PrimeColor.orange}
    position={new Vector2(0.9 * rs * Math.cos(thetaphi / 2), 0.9 * rs * Math.sin(thetaphi / 2)).add(
      new Vector2(Math.cos(thetaphi / 2), Math.sin(thetaphi / 2)).multiplyScalar(0.3)
    )}
    alignX="center"
    alignY="center"
  />
  <Angle2D
    startAngle={phi}
    endAngle={thetaphi}
    hasHead={true}
    distance={0.6 * s}
    color={PrimeColor.darkGreen}
    width={0.05}
  />
  <Latex2D
    latex="\theta"
    color={PrimeColor.darkGreen}
    position={new Vector2(
      0.6 * s * Math.cos(theta / 2 + phi),
      0.6 * s * Math.sin(theta / 2 + phi)
    ).add(new Vector2(Math.cos(theta / 2 + phi), Math.sin(theta / 2 + phi)).multiplyScalar(0.3))}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.5)}
  />
</Canvas2D>
