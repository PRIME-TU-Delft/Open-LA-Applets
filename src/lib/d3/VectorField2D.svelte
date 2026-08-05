<script lang="ts" module>
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Vector2D from './Vector2D.svelte';
  import Point2D from './Point2D.svelte';

  export type VectorField2DProps = {
    f: (x: number, y: number) => Vector2;
    xRange?: [number, number];
    yRange?: [number, number];
    step?: number;
    color?: PrimeColor;
    normalize?: boolean;
    normalizedLength?: number;
    hideHead?: boolean;
    anchor?: 'middle' | 'start' | 'end';
    colorFn?: (x: number, y: number) => PrimeColor | string;
  };
</script>

<script>
  let {
    f,
    xRange = [-GRID_SIZE_2D / 2, GRID_SIZE_2D / 2],
    yRange = [-GRID_SIZE_2D / 2, GRID_SIZE_2D / 2],
    step = 1,
    color = PrimeColor.black,
    normalize = true,
    normalizedLength = 1,
    hideHead = false,
    anchor = 'middle',
    colorFn = undefined
  } = $props();

  const buildRangeValues = (min: number, max: number, stepSize: number) => {
    if (stepSize <= 0) {
      return [min];
    }

    const values: number[] = [];
    let current = min;

    while (current < max - 1e-12) {
      values.push(current);
      current += stepSize;
    }

    if (values.length === 0 || Math.abs(values.at(-1)! - max) > 1e-12) {
      values.push(max);
    }

    return values;
  };

  let xValues = $derived.by(() => buildRangeValues(xRange[0], xRange[1], step));
  let yValues = $derived.by(() => buildRangeValues(yRange[0], yRange[1], step));
</script>

{#each yValues as y, i (i)}
  {#each xValues as x, j (i.toString() + '-' + j.toString())}
    {@const length = normalize ? (normalizedLength ?? 1) : new Vector2(x, y).length()}
    {@const origin =
      anchor === 'start'
        ? new Vector2(x, y)
        : anchor === 'end'
          ? new Vector2(x, y).add(f(x, y).clone().normalize().multiplyScalar(length))
          : new Vector2(x, y).sub(
              f(x, y)
                .clone()
                .normalize()
                .multiplyScalar(length / 2)
            )}

    {#if x < 1e-12 && x > -1e-12 && y < 1e-12 && y > -1e-12}
      <Point2D position={origin} color={colorFn ? colorFn(x, y) : color} />
    {:else}
      <Vector2D
        {origin}
        direction={f(x, y)}
        {length}
        color={colorFn ? colorFn(x, y) : color}
        {hideHead}
      />
    {/if}
  {/each}
{/each}
