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
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';

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
    new Vector2(-1, -1), // bottom-left
    new Vector2(5, 4), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: false,
    showAxisNumbersY: false,
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

  function SnapToGrid(position: Vector2): Vector2 {
    const re = position.x;
    const im = position.y;
    const theta = Math.atan2(im, re);
    const snappedR = 3;
    const snappedTheta = Number((theta / Math.PI).toFixed(2)) * Math.PI;
    const snappedX = snappedR * Math.cos(snappedTheta);
    const snappedY = snappedR * Math.sin(snappedTheta);
    return new Vector2(snappedX, snappedY);
  }
  const r = 3;
  const theta = 0.3 * Math.PI;
  const re = r * Math.cos(theta);
  const im = r * Math.sin(theta);
  const draggablePoint = [
    new Draggable(new Vector2(re, im), PrimeColor.grey, undefined, SnapToGrid)
  ];
  const formulas = $derived.by(() => {
    const re = draggablePoint[0].position.x;
    const im = draggablePoint[0].position.y;
    const theta = Math.atan2(im, re);
    return new Formulas(
      new Formula(
        '\\theta&=' +
          (theta / Math.PI)
            .toFixed(2)
            .replace('1.00', '')
            .replace(/\.?0+$/, '') +
          '\\pi',
        undefined,
        undefined,
        PrimeColor.grey
      )
    ).align();
  });
</script>

<Canvas2D
  draggables={draggablePoint}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
  {formulas}
  showFormulasDefault={true}
>
  <ParameterizedFunction2D
    xFunc={(t: number) => 3 * Math.cos(t)}
    yFunc={(t: number) => 3 * Math.sin(t)}
    tStart={0}
    tEnd={2 * Math.PI}
    width={0.05}
  />
  <Latex2D latex="1" position={new Vector2(3.15, -0.15)} alignX="left" alignY="top" />
  <Latex2D latex="-1" position={new Vector2(-3.15, -0.15)} alignX="right" alignY="top" />
  <Latex2D latex="1" position={new Vector2(-0.15, 3.15)} alignX="right" alignY="bottom" />
  <Latex2D latex="-1" position={new Vector2(-0.15, -3.15)} alignX="right" alignY="top" />
  {@const re = draggablePoint[0].position.x}
  {@const im = draggablePoint[0].position.y}
  {@const r = Math.sqrt(re * re + im * im)}
  {@const theta = Math.atan2(im, re)}
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(re, 0)}
    color={PrimeColor.yellow}
    width={0.05}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, im)}
    color={PrimeColor.blue}
    width={0.05}
  />
  <!-- Avoid cos(theta)==0 -->
  {#if Math.abs(Math.abs(theta) - Math.PI / 2) > 1e-3}
    <Line2D
      start={draggablePoint[0].position}
      end={new Vector2(3 / Math.cos(theta), 0)}
      color={PrimeColor.raspberry}
      width={0.05}
    />
    <Line2D
      start={new Vector2(0, 0)}
      end={new Vector2(3 / Math.cos(theta), 0)}
      color={PrimeColor.cyan}
      width={0.05}
    />
  {/if}
  <!-- Avoid sin(theta)==0 -->
  {#if Math.abs(theta) > 1e-3 || Math.abs(Math.abs(theta) - Math.PI) > 1e-3}
    <Line2D
      start={new Vector2(0, 0)}
      end={new Vector2(0, 3 / Math.sin(theta))}
      color={PrimeColor.orange}
      width={0.05}
    />
    <Line2D
      start={draggablePoint[0].position}
      end={new Vector2(0, 3 / Math.sin(theta))}
      color={PrimeColor.pink}
      width={0.05}
    />
  {/if}
  <Latex2D
    latex={String.raw`\cos(\theta)`}
    position={new Vector2(re / 2, im)}
    color={PrimeColor.blue}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
  />
  <Latex2D
    rotation={90}
    latex={String.raw`\sin(\theta)`}
    position={new Vector2(re, im / 2)}
    color={PrimeColor.yellow}
    alignY="center"
    alignX="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
  />
  <!-- Avoid cos(theta)==0 -->
  {#if Math.abs(Math.abs(theta) - Math.PI / 2) > 1e-3}
    <Latex2D
      rotation={(theta / Math.PI) * 180 - 90}
      latex={String.raw`\tan(\theta)`}
      position={new Vector2(
        3 / Math.cos(theta) / 2 + draggablePoint[0].position.x / 2,
        draggablePoint[0].position.y / 2
      )}
      color={PrimeColor.raspberry}
      alignY="center"
      alignX="center"
      background={PrimeColor.white + PrimeColor.opacity(0.8)}
    />
    <Latex2D
      latex={String.raw`\sec(\theta)`}
      position={new Vector2(3 / Math.cos(theta) / 2, 0)}
      color={PrimeColor.cyan}
      alignY="center"
      alignX="center"
      background={PrimeColor.white + PrimeColor.opacity(0.8)}
    />
    <Latex2D
      rotation={(theta / Math.PI) * 180 - 90}
      latex={String.raw`\cot(\theta)`}
      position={new Vector2(
        draggablePoint[0].position.x / 2,
        3 / Math.sin(theta) / 2 + draggablePoint[0].position.y / 2
      )}
      color={PrimeColor.pink}
      alignY="center"
      alignX="center"
      background={PrimeColor.white + PrimeColor.opacity(0.8)}
    />
  {/if}
  <!-- Avoid sin(theta)==0 -->
  {#if Math.abs(theta) > 1e-3 || Math.abs(Math.abs(theta) - Math.PI) > 1e-3}
    <Latex2D
      rotation={90}
      latex={String.raw`\csc(\theta)`}
      position={new Vector2(0, 3 / Math.sin(theta) / 2)}
      color={PrimeColor.orange}
      alignY="center"
      alignX="center"
      background={PrimeColor.white + PrimeColor.opacity(0.8)}
    />
  {/if}
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, 0)}
    color={PrimeColor.grey}
    width={0.05}
  />
  <Angle2D
    startAngle={0}
    endAngle={theta}
    hasHead={true}
    distance={0.2 * r}
    color={PrimeColor.grey}
    width={0.05}
  />
  <Latex2D
    latex="\theta"
    color={PrimeColor.grey}
    position={new Vector2(0.2 * r * Math.cos(theta / 2), 0.2 * r * Math.sin(theta / 2))}
    extend={0.3}
    alignX="center"
    alignY="center"
    background={PrimeColor.white + PrimeColor.opacity(0.8)}
  />
</Canvas2D>
