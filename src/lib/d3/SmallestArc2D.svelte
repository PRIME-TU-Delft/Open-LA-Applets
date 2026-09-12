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
  import { getProjection2D } from './Projection2D';

  const props: SmallestArc2DProps = $props();

  const projection = getProjection2D();

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

  // `distance` is a screen-space radius, so the bisector (and the straight-angle
  // fallback below) are computed in screen space, then converted back to world
  // space since label consumers (e.g. Latex2D) expect a world-space position and
  // project it themselves.
  const screenBisector = $derived(
    projection.toScreenDir(v).clone().add(projection.toScreenDir(w)).normalize()
  );
  const labelPosition = $derived(
    projection.toWorld(screenBisector.clone().multiplyScalar(props.distance || 1))
  );

  const screenVDir = $derived(projection.toScreenDir(v));
  const straightLabelPosition = $derived(
    projection.toWorld(new Vector2(-screenVDir.y, screenVDir.x).multiplyScalar(props.distance || 1))
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
  <Angle2D {...props} startAngle={v.angle()} endAngle={w.angle()} />
  {@render props.label?.(straightLabelPosition)}
{:else if angle < 0 || angle > 1}
  <Angle2D {...props} startAngle={w.angle()} endAngle={v.angle()} />
  {@render props.label?.(labelPosition)}
{:else}
  <Angle2D {...props} startAngle={v.angle()} endAngle={w.angle()} />
  {@render props.label?.(labelPosition)}
{/if}
