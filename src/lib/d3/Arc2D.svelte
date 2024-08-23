<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import Angle2D from './Angle2D.svelte';

  type ArcProps = {
    color?: string;
    points?: Vector2[];
    origin?: Vector2;
    width?: number;
    distance?: number;
    hasHead?: boolean;
  };

  let {
    color = PrimeColor.black,
    points = [new Vector2(1, 0), new Vector2(0, 1)],
    origin = new Vector2(0, 0),
    width = LINE_WIDTH,
    distance = 0.8,
    hasHead = false
  }: ArcProps = $props();

  const startAngle = $derived(points[0].angle());
  const endAngle = $derived(points[1].angle());
</script>

<Angle2D {color} {startAngle} {endAngle} {origin} {width} {distance} {hasHead} />
