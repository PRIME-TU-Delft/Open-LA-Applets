<script lang="ts">
  import { Vector2 } from 'three';

  type ShadowTrailProps = {
    color?: string;
    opacity?: number;
    maxTrailLength?: number;
    minDistanceNextPoint?: number;
    currentPosition?: Vector2;
  };

  let {
    color = 'black',
    opacity = 0.75,
    maxTrailLength = 30,
    minDistanceNextPoint = 0.25,
    currentPosition = new Vector2(0, 0)
  }: ShadowTrailProps = $props();

  let points: Vector2[] = $state([]);
  let lastPoint = $derived(points[points.length - 1]);

  let timeout: typeof setTimeout;

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function removePoints(timeBuffer: number) {
    const pointsLengths = points.length;
    for (let i = 0; i < pointsLengths; i++) {
      // Perform some task with the current item
      points.shift();

      // Wait for the specified delay before processing the next item
      await sleep(timeBuffer / points.length);
    }
  }

  $effect(() => {
    // If there are no points, add the current position
    if (points.length == 0) {
      points = [currentPosition.clone()];
      timeout = setTimeout(() => removePoints(1000), 5000);
      return;
    }

    // If there is no last point, return because we can't calculate the distance
    if (!lastPoint) return;

    // If the distance between the current position and the last point is greater than the minimum distance
    if (currentPosition.distanceTo(lastPoint) > minDistanceNextPoint) {
      points = [...points, currentPosition.clone()];
    }

    // If the trail length is greater than the maximum trail length, remove the first point
    if (points.length > maxTrailLength) {
      points.shift();
    }
  });
</script>

{#if lastPoint}
  {#each points as point, index}
    {#if index < points.length - 1}
      <line
        x1={point.x}
        y1={point.y}
        x2={points[index + 1].x}
        y2={points[index + 1].y}
        stroke={color}
        stroke-opacity={opacity * (index / points.length)}
        stroke-width="0.05"
      />
    {:else}
      <line
        x1={currentPosition.x}
        y1={currentPosition.y}
        x2={lastPoint.x}
        y2={lastPoint.y}
        stroke={color}
        stroke-opacity={opacity}
        stroke-width="0.05"
      />
    {/if}
  {/each}
{/if}
