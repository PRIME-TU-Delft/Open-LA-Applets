<script lang="ts">
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

  const controls = Controls.addSlider(3, 3, 8, 1, PrimeColor.blue) // m
    .addSlider(-16, -64, -8, 8, PrimeColor.darkGreen) // a
    .addSlider(16, 8, 64, 8, PrimeColor.raspberry); // b

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
    Math.pow(Math.sqrt(controls[1] * controls[1] + controls[2] * controls[2]), 1 / controls[0])
  );
  const threePhi = $derived(cartesianToPolar(new Vector2(controls[1], controls[2])).angleInRadians);

  const phi = $derived(threePhi / controls[0]);
  const deltaAngle = $derived((2 / controls[0]) * Math.PI);

  const formulas = $derived.by(() => {
    const m = round(controls[0]);
    const a = round(controls[1]);
    const b = round(controls[2]);

    const f1 = new Formula('z^{\\$1} &= \\$2 + \\$3i')
      .addAutoParam(m, PrimeColor.blue)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry);
    const f2 = new Formula('r &= \\sqrt[\\$1]{\\sqrt{\\$2^2+\\$3^2}}=\\$4')
      .addAutoParam(m, PrimeColor.blue)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(round(radius), PrimeColor.blue);
    const f3 = new Formula('3\\phi &= \\arg(\\$1 + \\$2)=\\$3\\pi')
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry)
      .addAutoParam(round(threePhi / Math.PI), PrimeColor.blue);

    return new Formulas(f1, f2, f3).align();
  });
</script>

<Canvas2D showAxisNumbers={false} {controls} {formulas}>
  <!-- K-th ANGLE -->
  {#each new Array(controls[0] - 1) as _, i}
    {@const kPosition = polarToCartesian(radius, phi + deltaAngle * i)}
    {@const kNextPosition = polarToCartesian(radius, phi + deltaAngle * (i + 1))}

    <Line2D start={kPosition} end={kNextPosition} color={PrimeColor.cyan} />

    <Latex2D
      latex={`\\frac{2}{${controls[0]}}\\pi`}
      position={kPosition.clone().add(kNextPosition).normalize().multiplyScalar(radius)}
      fontSize={0.5}
      offset={new Vector2(-0.25, 0.1)}
      extend={0.5}
      color={PrimeColor.raspberry}
    />

    <Point2D position={kNextPosition} color={PrimeColor.cyan} />

    <Angle2D
      color={PrimeColor.raspberry}
      distance={radius}
      startAngle={phi + deltaAngle * i}
      endAngle={phi + deltaAngle * (i + 1)}
      hasHead
    />

    {@render pointLabel(phi + deltaAngle * (i + 1))}
  {/each}

  <!-- FIRST ANGLE -->
  {@const kLast = phi + deltaAngle * (controls[0] - 1)}
  {@const kLastPosition = polarToCartesian(radius, kLast)}
  <Point2D position={polarToCartesian(radius, phi)} color={PrimeColor.cyan} />

  <Line2D start={kLastPosition} end={polarToCartesian(radius, phi)} color={PrimeColor.cyan} />

  <Angle2D color={PrimeColor.darkGreen} hasHead distance={radius} startAngle={0} endAngle={phi} />

  <Latex2D
    latex={`${round(phi / Math.PI)}\\pi`}
    position={polarToCartesian(radius, phi)
      .add(new Vector2(radius, 0))
      .normalize()
      .multiplyScalar(radius)}
    fontSize={0.5}
    offset={new Vector2(-0.25, 0.1)}
    extend={0.5}
    color={PrimeColor.darkGreen}
  />

  {@render pointLabel(phi)}

  <!-- LAST ANGLE -->
  <Angle2D
    color={PrimeColor.yellow}
    distance={radius}
    startAngle={kLast}
    endAngle={2 * Math.PI}
    hasHead
  />

  <Latex2D
    latex={`${round((deltaAngle - phi) / Math.PI)}\\pi`}
    position={kLastPosition.add(new Vector2(radius, 0)).normalize().multiplyScalar(radius)}
    fontSize={0.5}
    offset={new Vector2(-0.25, 0.1)}
    extend={0.5}
    color={PrimeColor.yellow}
  />
</Canvas2D>

{#snippet pointLabel(angle: number)}
  {@const position = polarToCartesian(radius, angle)}
  {@const y = round(position.y)}

  <Latex2D
    latex="{round(position.x)} {y < 0 ? y : '+ ' + y}i"
    {position}
    offset={new Vector2(-0.5, 0.1)}
    fontSize={0.8}
    extend={0.5}
  />
{/snippet}
