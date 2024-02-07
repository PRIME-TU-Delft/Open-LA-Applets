<script lang="ts">
  import { Canvas2D, Line2D } from '$lib/d3-components';
  import Angle from '$lib/d3-components/Angle.svelte';
  import Latex2D from '$lib/d3-components/Latex.svelte';
  import Point from '$lib/d3-components/Point.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Slider, Sliders } from '$lib/utils/Slider';
  import { Vector2 } from 'three';

  let sliders = new Sliders()
    .add(new Slider(3, 3, 10, 1, PrimeColor.blue))
    .add(new Slider(0.25, 0, 1, 0.125, PrimeColor.darkGreen));

  function createFormulas(fraction: number, offset: number) {
    return [
      new Formula(
        '\\text{offset} = \\frac{\\$}{4} \\pi',
        Math.round(offset * 4).toFixed(1),
        PrimeColor.darkGreen
      ),
      new Formula(
        '\\text{arc length} = \\frac{2}{\\$} \\pi',
        Math.round(fraction).toFixed(1),
        PrimeColor.red
      )
    ];
  }

  // const formulas = [new Formula('\\text{offset} = \\$ \\pi', sliders.y, PrimeColor.darkGreen)];
  $: formulas = createFormulas(sliders.x, sliders.y);

  const distance = 2 * Math.sqrt(2);

  function polarToCartesian(
    radius: number,
    angleInRadians: number,
    centerX: number = 0,
    centerY: number = 0
  ) {
    return new Vector2(
      centerX + radius * Math.cos(angleInRadians),
      centerY + radius * Math.sin(angleInRadians)
    );
  }
</script>

<Canvas2D showAxisNumbers={false} bind:sliders {formulas}>
  <!-- Start angle (green) -->
  <Point position={polarToCartesian(distance, Math.PI * sliders.y)} color={PrimeColor.blue} />
  <Line2D
    start={polarToCartesian(distance, Math.PI * sliders.y)}
    end={polarToCartesian(
      distance,
      ((Math.PI * 2) / sliders.x) * (sliders.x - 1) + Math.PI * sliders.y
    )}
    color={PrimeColor.blue}
  />

  <Angle
    color={PrimeColor.darkGreen}
    hasHead
    {distance}
    startAngle={0}
    endAngle={Math.PI * sliders.y}
  />

  <!-- Intermediate angles (red) -->
  {#each new Array(sliders.x) as _, i}
    {@const startAngle = ((Math.PI * 2) / sliders.x) * i + Math.PI * sliders.y}
    {@const endAngle = startAngle + (Math.PI * 2) / sliders.x}
    {@const startPos = polarToCartesian(distance, startAngle)}
    {@const endPos = polarToCartesian(distance, endAngle)}

    <Line2D start={startPos} end={endPos} color={PrimeColor.blue} />

    {@const latexPos = polarToCartesian(distance + 0.5, endAngle)}
    <Latex2D latex={endPos.x.toFixed(2) + ' + ' + endPos.y.toFixed(2) + 'i'} position={latexPos} />

    {#if startAngle > Math.PI * 2}
      <Point position={endPos} color={PrimeColor.blue} />
    {:else if endAngle < Math.PI * 2}
      <Point position={endPos} color={PrimeColor.blue} />
      <Angle color={PrimeColor.red} {distance} {startAngle} {endAngle} hasHead />
    {:else}
      <Point position={endPos} color={PrimeColor.blue} />
      <Angle color={PrimeColor.yellow} {distance} {startAngle} endAngle={Math.PI * 2} hasHead />
    {/if}
  {/each}
</Canvas2D>
