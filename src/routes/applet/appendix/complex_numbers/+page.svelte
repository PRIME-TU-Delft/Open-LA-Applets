<script lang="ts">
  import { Canvas2D, Line2D, Vector2D } from '$lib/d3-components';
  import Angle from '$lib/d3-components/Angle.svelte';
  import Latex2D from '$lib/d3-components/Latex.svelte';
  import Point from '$lib/d3-components/Point.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Slider, Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';

  let sliders = new Sliders()
    .add(new Slider(3, 3, 8, 1, PrimeColor.blue)) // m
    .add(new Slider(-16, -64, -8, 8, PrimeColor.purple)) // a
    .add(new Slider(16, 8, 64, 8, PrimeColor.pink)); // b

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

  $: polarForm = cartesian2Polar(new Vector2(sliders.y, sliders.z));
  $: radius = Math.pow(polarForm.radius, 1 / sliders.x);
  $: angle = polarForm.angleInRadians;

  function createFormulas(m: number, a: number, b: number) {
    const piAngle = polarForm.angleInRadians / Math.PI;

    return [
      new Formula(`z^{\\$1} = -\\$2 + \\$3i`)
        .addAutoParam(m, PrimeColor.blue)
        .addAutoParam(a, PrimeColor.purple)
        .addAutoParam(b, PrimeColor.pink),
      new Formula(
        `r = \\sqrt[\\$]{${polarForm.radius.toFixed(2)}} = ${radius.toFixed(2)}`,
        m,
        PrimeColor.blue
      ),
      new Formula(
        `\\phi = \\frac{\\arg(${a.toFixed(2)} + ${b.toFixed(2)}i)}{\\$} = \\frac{${(
          piAngle * m
        ).toFixed(2)}}{\\$}\\pi = ${piAngle.toFixed(2)}\\pi`,
        m,
        PrimeColor.blue
      )
    ];
  }

  $: formulas = createFormulas(sliders.x, sliders.y, sliders.z);
</script>

<Canvas2D showAxisNumbers={false} bind:sliders {formulas}>
  <!-- Start angle (green) -->
  <Point position={polarToCartesian(radius, angle)} color={PrimeColor.blue} />
  <Line2D
    start={polarToCartesian(radius, angle)}
    end={polarToCartesian(radius, angle + (Math.PI * 2) / sliders.x)}
    color={PrimeColor.blue}
  />

  <Angle color={PrimeColor.darkGreen} hasHead distance={radius} startAngle={0} endAngle={angle} />

  <!-- Intermediate angles (red) -->
  {#each new Array(sliders.x) as _, i}
    {@const startAngle = angle + (Math.PI * 2 * i) / sliders.x}
    {@const endAngle = startAngle + (Math.PI * 2) / sliders.x}
    {@const startPos = polarToCartesian(radius, startAngle)}
    {@const endPos = polarToCartesian(radius, endAngle)}
    {@const latexPos = polarToCartesian(radius + 0.5, endAngle)}

    <Line2D start={startPos} end={endPos} color={PrimeColor.blue} />

    {#key endAngle}
      <Latex2D
        latex={endPos.x.toFixed(2) + ' + ' + endPos.y.toFixed(2) + 'i'}
        position={latexPos}
      />
    {/key}

    {#if startAngle > Math.PI * 2}
      <Point position={endPos} color={PrimeColor.blue} />
    {:else if endAngle < Math.PI * 2}
      <Point position={endPos} color={PrimeColor.blue} />
      <Angle color={PrimeColor.red} distance={radius} {startAngle} {endAngle} hasHead />
    {:else}
      <Point position={endPos} color={PrimeColor.blue} />
      <Angle
        color={PrimeColor.yellow}
        distance={radius}
        {startAngle}
        endAngle={Math.PI * 2}
        hasHead
      />
    {/if}
  {/each}
</Canvas2D>
