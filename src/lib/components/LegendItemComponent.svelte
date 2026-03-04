<script lang="ts">
  import { FillType, LegendItem, Shape } from '$lib/utils/Legend';

  const { legendI }: { legendI: LegendItem } = $props();

  const isDashed = $derived(legendI.fillType == FillType.Dashed);
  const isBorder = $derived(legendI.fillType == FillType.Border);
  const patternId = $derived(
    `legend-dashed-pattern-${legendI.color.toString().replace(/[^a-zA-Z0-9]/g, '')}`
  );
  const fill = $derived(
    isDashed ? `url(#${patternId})` : isBorder ? 'none' : legendI.color.toString()
  );
  const strokeWidth = 3;

  const triPoints = $derived.by(() => {
    const cx = 10,
      cy = 10,
      r = 8;
    const top = `${cx},${cy - r}`;
    const br = `${cx + r * Math.sin((2 * Math.PI) / 3)},${cy - r * Math.cos((2 * Math.PI) / 3)}`;
    const bl = `${cx + r * Math.sin((4 * Math.PI) / 3)},${cy - r * Math.cos((4 * Math.PI) / 3)}`;
    return `${top} ${br} ${bl}`;
  });
</script>

<div class="flex items-center justify-start gap-2">
  <svg class="h-5 w-5" viewBox="0 0 20 20">
    {#if isDashed}
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="4" stroke={legendI.color.toString()} stroke-width="4" />
        </pattern>
      </defs>
    {/if}

    {#if legendI.shape === Shape.Square}
      <rect
        x={2 + strokeWidth / 2}
        y={2 + strokeWidth / 2}
        width={16 - strokeWidth}
        height={16 - strokeWidth}
        {fill}
        stroke={legendI.color.toString()}
        stroke-width={strokeWidth}
      />
    {:else if legendI.shape === Shape.Triangle}
      <polygon
        points={triPoints}
        {fill}
        stroke={legendI.color.toString()}
        stroke-width={strokeWidth}
        stroke-linejoin="round"
      />
    {:else}
      <circle
        r={8}
        cx={10}
        cy={10}
        {fill}
        stroke={legendI.color.toString()}
        stroke-width={strokeWidth}
      />
    {/if}
  </svg>
  <span class="text-sm">{legendI.label}</span>
</div>
