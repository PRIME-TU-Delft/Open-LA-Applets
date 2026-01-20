<script lang="ts">
  import { FillType, LegendItem } from '$lib/utils/Legend';

  const { legendI }: { legendI: LegendItem } = $props();

  const isDashed = legendI.fillType == FillType.Dashed;
  const patternId = `legend-dashed-pattern-${legendI.color.toString().replace(/[^a-zA-Z0-9]/g, '')}`;
  const fill = isDashed
    ? `url(#${patternId})`
    : legendI.fillType != FillType.Border
      ? legendI.color.toString()
      : 'none';
</script>

<div class="flex items-center justify-start gap-2">
  <svg class="h-5 w-5">
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
    <circle
      r="40%"
      cx="50%"
      cy="50%"
      {fill}
      fill-opacity={legendI.fillType == FillType.Border ? 0 : 1}
      stroke={legendI.color.toString()}
      stroke-width={3}
    />
  </svg>
  <span class="text-sm">{legendI.label}</span>
</div>
