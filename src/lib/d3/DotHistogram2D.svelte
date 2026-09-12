<script module lang="ts">
  export type DotHistogram2DProps = {
    // One value (mean or sum) per accumulated sample, in draw order.
    values: number[];
    binWidth: number;
    // When true, each dot's height is 1/values.length (matching Histogram2D's
    // freq/totalFreq convention), so the stack never grows past y=1 regardless
    // of how many samples have been drawn.
    normalized?: boolean;
    selectedIndex?: number | null;
    color?: string;
    selectedColor?: string;
    radius?: number;
    onSelect?: (index: number) => void;
  };
</script>

<script lang="ts">
  import { LINE_WIDTH, POINT_SIZE } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { getProjection2D } from './Projection2D';

  const {
    values,
    binWidth,
    normalized = false,
    selectedIndex = null,
    color = PrimeColor.cyan,
    selectedColor = PrimeColor.raspberry,
    radius = POINT_SIZE,
    onSelect
  }: DotHistogram2DProps = $props();

  const projection = getProjection2D();

  // Stack each sample within its bin by insertion order, so the stack heights
  // form a running histogram of the accumulated samples.
  const dots = $derived.by(() => {
    const stackHeight: Record<number, number> = {};
    const total = normalized ? Math.max(values.length, 1) : 1;

    return values.map((value, index) => {
      const bin = Math.floor(value / binWidth) * binWidth;
      const height = stackHeight[bin] ?? 0;
      stackHeight[bin] = height + 1;

      const position = new Vector2(bin + binWidth / 2, (height + 0.5) / total);
      return { index, position };
    });
  });
</script>

{#each dots as dot (dot.index)}
  {@const screenPosition = projection.toScreen(dot.position)}
  {@const isSelected = dot.index === selectedIndex}
  <g
    class="dot"
    role="button"
    tabindex="0"
    onclick={() => onSelect?.(dot.index)}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.(dot.index);
      }
    }}
  >
    <circle
      cx={screenPosition.x}
      cy={screenPosition.y}
      r={isSelected ? radius * 1.5 : radius}
      stroke={isSelected ? selectedColor : color}
      stroke-width={LINE_WIDTH}
      fill={isSelected ? selectedColor : color}
    />
  </g>
{/each}

<style>
  .dot {
    cursor: pointer;
  }
</style>
