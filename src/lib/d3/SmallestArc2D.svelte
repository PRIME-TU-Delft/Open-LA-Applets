<script lang="ts" module>
  import type { Arc2DProps } from './Arc2D.svelte';

  type LabelProp = {
    label?: Snippet<[Vector2]>;
  };

  export type SmallestArc2DProps = Arc2DProps & LabelProp;
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Angle2D from './Angle2D.svelte';

  const props: SmallestArc2DProps = $props();

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
  const labelPosition = $derived(
    v
      .clone()
      .normalize()
      .add(w.clone().normalize())
      .normalize()
      .multiplyScalar(props.distance || 1)
  );
</script>

<!-- 
@component
  @name SmallestArc2D
  @description
    A component that renders the smallest arc between two vectors. i.e. the arc that is less than PI/180deg.
  @props
    - points: Vector2[] - The two vectors that define the arc.
    - distance: number - The distance of the arc from the origin.
    - label: (position: Vector2) => Snippet - A function that returns a snippet that renders the label of the arc.

  @example
  <SmallestArc2D points={[w, v]} distance={1.5}>
    {#snippet label(position)}
      <Latex2D
        latex={'\\varphi'}
        {position}
        offset={new Vector2(0, 0.1)}
        extend={0.1}
        color={PrimeColor.black}
      />
    {/snippet}
  </SmallestArc2D>

-->

{#if angle == 1}
  {@const labelPosition = v.clone().normalize()}
  <Angle2D {...props} startAngle={v.angle()} endAngle={w.angle()} />
  {@render props.label?.(new Vector2(-labelPosition.y, labelPosition.x))}
{:else if angle < 0 || angle > 1}
  <Angle2D {...props} startAngle={w.angle()} endAngle={v.angle()} />
  {@render props.label?.(labelPosition)}
{:else}
  <Angle2D {...props} startAngle={v.angle()} endAngle={w.angle()} />
  {@render props.label?.(labelPosition)}
{/if}
