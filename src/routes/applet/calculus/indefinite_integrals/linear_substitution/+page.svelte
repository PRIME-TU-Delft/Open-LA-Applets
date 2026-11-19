<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import { LegendItem } from '$lib/utils/Legend';
  import { Draggable } from '$lib/controls/Draggables.svelte';

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
    new Vector2(-3, -5.5), // bottom-left
    new Vector2(15, 7.5), // top-right
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

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = 'x';
  yAxisLabel = 'y';

  // ##############
  // APPLET OBJECTS
  // ##############
  const controls = Controls.addSlider(1, -5, 5, 0.1, PrimeColor.pink, {
    label: toLatexText('$\\alpha=$'),
    valueFn: (v: number) => toLatexText('$' + (v >= 0 ? '\\phantom{-}' : '') + v.toFixed(1) + '$')
  }).addSlider(-1, -5, 5, 0.1, PrimeColor.orange, {
    label: toLatexText('$\\beta=$'),
    valueFn: (v: number) => toLatexText('$' + (v >= 0 ? '\\phantom{-}' : '') + v.toFixed(1) + '$')
  });

  const LegendLine = new LegendItem('y=\\$1 x+\\$2', PrimeColor.blue, 'square')
    .addAutoParam('\\alpha', PrimeColor.pink)
    .addAutoParam('\\beta', PrimeColor.orange);

  function SnapToYAXis(position: Vector2): Vector2 {
    const snappedY = Number(position.y.toFixed(1));
    const snappedX = 0;

    return new Vector2(snappedX, snappedY);
  }

  const draggables = [
    new Draggable(
      new Vector2(0, 1),
      PrimeColor.green,
      undefined,
      SnapToYAXis,
      undefined,
      undefined,
      1.5 * 0.12
    ),
    new Draggable(
      new Vector2(0, 5),
      PrimeColor.darkGreen,
      undefined,
      SnapToYAXis,
      undefined,
      undefined,
      2 * 0.12,
      'triangle'
    )
  ];

  const LegendC = $derived(
    new LegendItem(
      'c=' + (draggables[0].position.y > 0 ? '\\phantom{-}' : '') + '\\$1',
      PrimeColor.green,
      'circle'
    ).addAutoParam(draggables[0].position.y.toFixed(1), PrimeColor.green)
  );
  const LegendD = $derived(
    new LegendItem(
      'd=' + (draggables[1].position.y > 0 ? '\\phantom{-}' : '') + '\\$1',
      PrimeColor.darkGreen,
      'triangle'
    ).addAutoParam(draggables[1].position.y.toFixed(1), PrimeColor.darkGreen)
  );

  // map to x-values
  const firstX = $derived((draggables[0].position.y - controls[1]) / controls[0]);
  const secondX = $derived((draggables[1].position.y - controls[1]) / controls[0]);
</script>

<Canvas2D
  {draggables}
  {controls}
  {initialViewBox}
  legendItems={[LegendC, LegendD, LegendLine]}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
>
  <InfiniteLine2D
    origin={draggables[0].position}
    direction={new Vector2(1, 0)}
    color={PrimeColor.green}
    width={0.12}
  />
  <InfiniteLine2D
    origin={draggables[1].position}
    direction={new Vector2(1, 0)}
    color={PrimeColor.darkGreen}
    width={0.12}
  />
  <InfiniteLine2D
    origin={new Vector2(0, controls[1])}
    direction={new Vector2(1, controls[0])}
    color={PrimeColor.blue}
    width={0.12}
  />
  {#if Number(controls[0].toFixed(1)) != 0}
    <InfiniteLine2D
      origin={new Vector2(firstX, draggables[0].position.y)}
      direction={new Vector2(0, 1)}
      color={PrimeColor.green}
      width={0.12}
      isDashed={true}
    />
    <InfiniteLine2D
      origin={new Vector2(secondX, draggables[1].position.y)}
      direction={new Vector2(0, 1)}
      color={PrimeColor.darkGreen}
      width={0.12}
      isDashed={true}
    />
  {/if}
</Canvas2D>
