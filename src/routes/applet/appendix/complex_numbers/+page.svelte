<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Arc2D from '$lib/d3/Arc2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const controls = Controls.addSlider(3, 3, 8, 1, PrimeColor.blue) // m
    .addSlider(-16, -64, -8, 8, PrimeColor.darkGreen) // a
    .addSlider(16, 8, 64, 8, PrimeColor.raspberry); // b

  function cartesian2Polar(vec2: Vector2, offset: Vector2 = new Vector2(0, 0)) {
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

  const roundRadius = $derived(Math.round(controls[0]));
  const polarForm = $derived(cartesian2Polar(new Vector2(controls[1], controls[2])));
  const radius = $derived(Math.pow(polarForm.radius, 1 / roundRadius));
  const angle = $derived(polarForm.angleInRadians);

  const formulas = $derived.by(() => {
    const m = roundRadius;
    const a = controls[1];
    const b = controls[2];
    const piAngle = polarForm.angleInRadians / Math.PI;

    const f1 = new Formula('z^{\\$1} &= \\$2 + \\$3i')
      .addAutoParam(m, PrimeColor.blue)
      .addAutoParam(a, PrimeColor.darkGreen)
      .addAutoParam(b, PrimeColor.raspberry);
    const f2 = new Formula(
      `\\phi &= \\frac{\\arg(${a.toFixed(2)} + ${b.toFixed(2)}i)}{\\$1}`
    ).addAutoParam(m, PrimeColor.blue);
    const f3 = new Formula(
      `r &= \\sqrt[\\$1]{${polarForm.radius.toFixed(2)}} = ${radius.toFixed(2)}`
    ).addAutoParam(m, PrimeColor.blue);
    const f4 = new Formula(
      `&= \\frac{${(piAngle * m).toFixed(2)}}{\\$1}\\pi = ${piAngle.toFixed(2)}\\pi`
    ).addAutoParam(m, PrimeColor.blue);

    return new Formulas(f1, f2, f3, f4).align();
  });
</script>

<Canvas2D showAxisNumbers={false} {controls} {formulas}>
  <!-- Start angle (green) -->
  <Point2D position={polarToCartesian(radius, angle)} color={PrimeColor.blue} />
  <Line2D
    start={polarToCartesian(radius, angle)}
    end={polarToCartesian(radius, angle + (Math.PI * 2) / Math.round(roundRadius))}
    color={PrimeColor.blue}
  />

  <Angle2D color={PrimeColor.darkGreen} hasHead distance={radius} startAngle={0} endAngle={angle} />

  <!-- Intermediate angles (red) -->
  {#each new Array(Math.round(roundRadius)) as _, i}
    {@const startAngle = angle + (Math.PI * 2 * i) / roundRadius}
    {@const endAngle = startAngle + (Math.PI * 2) / roundRadius}
    {@const startPos = polarToCartesian(radius, startAngle)}
    {@const endPos = polarToCartesian(radius, endAngle)}
    {@const latexPos = polarToCartesian(radius, endAngle)}

    <Line2D start={startPos} end={endPos} color={PrimeColor.blue} />

    <Latex2D
      latex={endPos.x.toFixed(2) + ' + ' + endPos.y.toFixed(2) + 'i'}
      position={latexPos.clone().multiplyScalar(1.3)}
    />

    {#if startAngle > Math.PI * 2}
      <Point2D position={endPos} color={PrimeColor.blue} />
    {:else if endAngle < Math.PI * 2}
      <Point2D position={endPos} color={PrimeColor.blue} />
      <Angle2D color={PrimeColor.raspberry} distance={radius} {startAngle} {endAngle} hasHead />
    {:else}
      <Point2D position={endPos} color={PrimeColor.blue} />
      <Angle2D
        color={PrimeColor.yellow}
        distance={radius}
        {startAngle}
        endAngle={Math.PI * 2}
        hasHead
      />
    {/if}
  {/each}
</Canvas2D>
