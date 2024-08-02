<script lang="ts">
  import { Vector2 } from 'three';
  import Latex from '$lib/components/Latex.svelte';

  type Latex2DProps = {
    latex: string;
    fontSize?: number;
    position?: Vector2;
    offset?: Vector2;
    extend?: number;
    color?: string;
  };

  let {
    latex,
    fontSize = 1,
    position = new Vector2(0, 0),
    offset = new Vector2(0, 0),
    extend = 0,
    color = 'black'
  }: Latex2DProps = $props();

  let extendedOffset = $derived(position.clone().normalize().multiplyScalar(extend));
</script>

<g
  transform="translate({position.x + offset.x + extendedOffset.x}, {position.y +
    offset.y +
    extendedOffset.y}) scale({0.02 * fontSize},{-0.02 * fontSize})"
>
  <foreignObject x="0" y="0" width="100%" height="100%" class="overflow-visible">
    <Latex class="absolute -translate-x-1/2 -translate-y-1/2" {latex} {color} />
  </foreignObject>
</g>
