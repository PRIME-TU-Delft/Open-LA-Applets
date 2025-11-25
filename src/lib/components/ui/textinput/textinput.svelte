<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils.js';
  import type { HTMLInputAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLInputAttributes>> = $props();
</script>

<input
  type="text"
  bind:this={ref}
  data-slot="textarea"
  class={cn(
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-[180px] rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    className
  )}
  bind:value
  {...restProps}
/>
