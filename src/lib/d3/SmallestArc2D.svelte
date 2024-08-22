<script lang="ts">
  import Angle2D from './Angle2D.svelte';
  import type { ArcProps } from './Arc2D.svelte';

  const props: ArcProps = $props();

  const v = $derived(props.points[0]);
  const w = $derived(props.points[1]);

  const inverted = $derived.by(() => {
    if (v.angle() > w.angle() && (w.angle() + Math.PI) % (2 * Math.PI) > v.angle()) return true;

    if (v.angle() < w.angle() && (v.angle() + Math.PI) % (2 * Math.PI) < w.angle()) return true;

    return false;
  });

  const bothBelowZero = $derived.by(() => {
    if (v.y < 0 && w.y < 0) return !inverted;
    return inverted;
  });
</script>

<!-- 
@component
This component is a mess and should be refactored. It is used to draw the smallest arc between two vectors.
But the logic is all over the place and the code is hard to read.
-->

{#if bothBelowZero}
  <Angle2D {...props} startAngle={w.angle()} endAngle={v.angle()} />
{:else}
  <Angle2D {...props} startAngle={v.angle()} endAngle={w.angle()} />
{/if}
