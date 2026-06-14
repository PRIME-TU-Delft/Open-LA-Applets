<script lang="ts">
  import type { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex from '../Latex.svelte';

  const {
    label,
    color,
    checkLatex,
    latex
  }: { label: string; color?: PrimeColor; checkLatex?: string; latex?: boolean } = $props();
</script>

{#if latex || label.includes('{') || label.includes('\\') || checkLatex?.includes('{') || checkLatex?.includes('\\')}
  <Latex latex={label} color={color?.toString()} />
{:else}
  {label}
{/if}
