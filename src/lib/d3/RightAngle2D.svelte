<script lang="ts" module>
  export type RightAngle2DProps = {
    vs: [Vector2, Vector2];
    origin?: Vector2;
    size?: number;
    color?: string;
    lineWidth?: number;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import Line from './Line2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { getContext, setContext } from 'svelte';

  let {
    vs,
    origin = new Vector2(0, 0),
    size = 0.3,
    color = PrimeColor.black,
    lineWidth = 0.02
  }: RightAngle2DProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  // Prevent Line2D children from applying scale again (coordinates are passed in world space)
  setContext('scale2D', { x: 1, y: 1 });

  const scaledOrigin = $derived(new Vector2(origin.x * sx, origin.y * sy));

  //resize vectors
  const u1 = $derived(vs[0].clone().multiplyScalar(size / vs[0].length()));
  const u2 = $derived(vs[1].clone().multiplyScalar(size / vs[1].length()));
</script>

<!-- @component 
@name RightAngle2D
@description Draw a right angle in 2D space.
@props
- vs: [Vector2, Vector2] - The two vectors that form the right angle.
- origin: Vector2 - The origin of the right angle.
- size: number - The size of the right angle.
- color: string - The color of the right angle.
- lineWidth: number - The width of the lines that form the right angle.

 @example
<RightAngle2D vs={[new Vector2(1, 0), new Vector2(0, 1)]} />
-->

<!-- draw two lines to represent right angle if perpendicular -->
{#if Math.abs(u1.dot(u2)) <= 0.005 && !u1.equals(u2)}
  <Line
    {color}
    width={lineWidth}
    start={u1.clone().add(scaledOrigin)}
    end={u1.clone().add(u2).add(scaledOrigin)}
  />
  <Line
    {color}
    width={lineWidth}
    start={u2.clone().add(scaledOrigin)}
    end={u1.clone().add(u2).add(scaledOrigin)}
  />
{/if}
