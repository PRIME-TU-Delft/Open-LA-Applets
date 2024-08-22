<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Angle2D from './Angle2D.svelte';
  import type { ArcProps } from './Arc2D.svelte';

  type LabelProp = {
    label?: Snippet<[Vector2]>;
  };

  const props: ArcProps & LabelProp = $props();

  const v = $derived(props.points[0]);
  const w = $derived(props.points[1]);

  /**
   * Makes sure that an angle is sticktly between 0 and 2 * PI
   * @param angle
   */
  function normalizeAngle(angle: number) {
    angle = angle % (2 * Math.PI);

    return angle < 0 ? angle + 2 * Math.PI : angle;
  }

  const angle = $derived(normalizeAngle(w.angle() - v.angle()) / Math.PI);
  const labelPosition = $derived(v.clone().normalize().add(w.clone().normalize()).normalize());
</script>

{#if angle == 1}
  {@const labelPosition = v.clone().normalize()}
  <Angle2D startAngle={v.angle()} endAngle={w.angle()} />
  {@render props.label?.(new Vector2(-labelPosition.y, labelPosition.x))}
{:else if angle < 0 || angle > 1}
  <Angle2D startAngle={w.angle()} endAngle={v.angle()} />
  {@render props.label?.(labelPosition)}
{:else}
  <Angle2D startAngle={v.angle()} endAngle={w.angle()} />
  {@render props.label?.(labelPosition)}
{/if}
