<script lang="ts">
  import { setContext } from 'svelte';
  setContext('dontScaleWithDefaultZoom', true);

  import { Controls } from '$lib/controls/Controls';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import { toLatexText } from '$lib/utils/FormatString';
  import PolarGrid from '$lib/d3/PolarGrid.svelte';
  import type { AxisProps } from '$lib/d3/Axis.svelte';

  let initialViewBox: ViewBox | undefined;
  let axis: AxisProps | undefined;
  let axisP: AxisProps | undefined;

  initialViewBox = new ViewBox(
    new Vector2(-5, -6), // bottom-left
    new Vector2(10, 4), // top-right
    0.5 // margin
  );
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

  const controls = Controls.addSlider(3, 3, 8, 1, PrimeColor.blue, {
    label: toLatexText('$m=$')
  }) // m
    .addSlider(-16, -64, -8, 8, PrimeColor.darkGreen, {
      label: toLatexText('$a=$')
    }) // a
    .addSlider(16, 8, 64, 8, PrimeColor.raspberry, {
      label: toLatexText('$b=$')
    }) // b
    .addToggle(true, toLatexText('Cartesian grid'), PrimeColor.black, {
      isSwitch: true,
      switchRightSide: toLatexText('Polar grid')
    });

  const m = $derived(Math.round(controls[0]));

  function cartesianToPolar(vec2: Vector2, offset: Vector2 = new Vector2(0, 0)) {
    const radius = offset.distanceTo(vec2);
    const angleInRadians = Math.atan2(vec2.y, vec2.x); //This takes y first
    return { radius, angleInRadians };
  }

  function polarToCartesian(
    radius: number,
    angleInRadians: number,
    offset: Vector2 = new Vector2(0, 0)
  ) {
    return new Vector2(
      offset.x + radius * Math.cos(angleInRadians),
      offset.y + radius * Math.sin(angleInRadians)
    );
  }

  const radius = $derived(
    Math.pow(Math.sqrt(controls[1] * controls[1] + controls[2] * controls[2]), 1 / m)
  );
  const threePhi = $derived(cartesianToPolar(new Vector2(controls[1], controls[2])).angleInRadians);

  const phi = $derived(threePhi / m);
  const deltaAngle = $derived((2 / m) * Math.PI);

  const formulas = $derived.by(() => {
    const a = round(controls[1]);
    const b = round(controls[2]);

    const f1 = new Formula('z^{\\$1} &= \\$2 + \\$3i')
      .addAutoParam(m, PrimeColor.blue)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry);
    const f2 = new Formula('r &= \\sqrt[\\$1]{\\sqrt{(\\$2)^2+\\$3^2}}\\approx\\$4')
      .addAutoParam(m, PrimeColor.blue)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(round(radius), PrimeColor.purple);
    const f3 = new Formula(
      '\\phi &= \\frac{1}{\\$4}\\arg(\\$1 + \\$2i)\\approx\\$3{\\color{' +
        PrimeColor.orange +
        '}\\pi}'
    )
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(round(phi / Math.PI), PrimeColor.orange)
      .addAutoParam(m, PrimeColor.blue);

    return new Formulas(f1, f2, f3).align();
  });
</script>

<Canvas2D
  axis={controls[3] ? axisP : axis}
  {controls}
  {formulas}
  showFormulasDefault
  {initialViewBox}
>
  {#if controls[3]}
    <PolarGrid showAngleTicks showRadiiTicks={false} />
  {/if}
  <Line2D start={new Vector2(0, 0)} end={polarToCartesian(radius, phi)} color={PrimeColor.purple} />
  <!-- K-th ANGLE -->
  {#each new Array(m - 1) as _, i (i)}
    {@const kPosition = polarToCartesian(radius, phi + deltaAngle * i)}
    {@const kNextPosition = polarToCartesian(radius, phi + deltaAngle * (i + 1))}
    {@const anglePosition = kPosition.clone().add(kNextPosition).normalize().multiplyScalar(radius)}

    <Line2D start={kPosition} end={kNextPosition} color={PrimeColor.cyan} isDashed />

    <Latex2D
      latex={`\\frac{2}{${m}}\\pi`}
      position={anglePosition}
      extend={0.2}
      alignX={anglePosition.x > 0 ? 'left' : 'right'}
      alignY={anglePosition.y > 0 ? 'bottom' : 'top'}
      color={PrimeColor.raspberry}
    />

    <Point2D position={kNextPosition} color={PrimeColor.cyan} />

    <Angle2D
      color={PrimeColor.raspberry}
      distance={radius}
      startAngle={phi + deltaAngle * i + 0.1 / radius}
      endAngle={phi + deltaAngle * (i + 1) - 0.1 / radius}
      hasHead
    />

    {@render pointLabel(phi + deltaAngle * (i + 1))}
  {/each}

  <!-- FIRST ANGLE -->
  {@const kLast = phi + deltaAngle * (m - 1)}
  {@const kLastPosition = polarToCartesian(radius, kLast)}
  <Point2D position={polarToCartesian(radius, phi)} color={PrimeColor.cyan} />

  <Line2D
    start={kLastPosition}
    end={polarToCartesian(radius, phi)}
    color={PrimeColor.cyan}
    isDashed
  />

  <Angle2D
    color={PrimeColor.orange}
    hasHead
    distance={radius}
    startAngle={0}
    endAngle={phi - 0.1 / radius}
  />

  {@const anglePosition = polarToCartesian(radius, phi)
    .add(new Vector2(radius, 0))
    .normalize()
    .multiplyScalar(radius)}
  <Latex2D
    latex={`${round(phi / Math.PI)}\\pi`}
    position={anglePosition}
    extend={0.2}
    color={PrimeColor.orange}
    alignX={anglePosition.x > 0 ? 'left' : 'right'}
    alignY={anglePosition.y > 0 ? 'bottom' : 'top'}
  />

  {@render pointLabel(phi)}

  <!-- LAST ANGLE -->
  <Angle2D
    color={PrimeColor.yellow}
    distance={radius}
    startAngle={kLast + 0.1 / radius}
    endAngle={2 * Math.PI}
    hasHead
  />

  {@const lastAnglePosition = kLastPosition
    .clone()
    .add(new Vector2(radius, 0))
    .normalize()
    .multiplyScalar(radius)}
  <Latex2D
    latex={`\\frac{2}{${m}}\\pi-${round(phi / Math.PI)}\\pi`}
    position={lastAnglePosition}
    extend={0.2}
    color={PrimeColor.yellow}
    alignX={lastAnglePosition.x > 0 ? 'left' : 'right'}
    alignY={lastAnglePosition.y > 0 ? 'bottom' : 'top'}
  />
</Canvas2D>

{#snippet pointLabel(angle: number)}
  {@const position = polarToCartesian(radius, angle)}
  {@const y = round(position.y)}

  <Latex2D
    latex="{round(position.x)} {y < 0 ? y : '+ ' + y}i"
    {position}
    extend={0.2}
    alignX={position.x > 0 ? 'left' : 'right'}
    alignY={position.y > 0 ? 'bottom' : 'top'}
  />
{/snippet}
