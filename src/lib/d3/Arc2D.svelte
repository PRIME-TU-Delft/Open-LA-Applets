<script context="module" lang="ts">
  export type ArcProps = {
    color?: string;
    points: Vector2[];
    origin?: Vector2;
    width?: number;
    distance?: number;
    hasHead?: boolean;
  };
</script>

<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import Angle2D from './Angle2D.svelte';

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

<!-- 
@component A component that renders an arc between two vectors.
  @name Arc2D
  @description
    A component that renders an arc between two vectors.
  @props
    - color: string - The color of the arc.
    - points: Vector2[] - The two vectors that define the arc.
    - origin: Vector2 - The origin of the arc.
    - width: number - The width of the arc.
    - distance: number - The distance of the arc from the origin.
    - hasHead: boolean - Whether the arc has a head.

  @example
  <Arc2D points={[w, v]} distance={1.5} />
  
-->

<Angle2D {color} {startAngle} {endAngle} {origin} {width} {distance} {hasHead} />
