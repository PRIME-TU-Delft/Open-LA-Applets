<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { cn } from '$lib/utils/shadcn-utils';
  import type { Snippet } from 'svelte';

  type ButtonActionProps = {
    class?: string;
    tooltip: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  };

  let {
    class: className = '',
    tooltip,
    side = 'left',
    onclick,
    children
  }: ButtonActionProps = $props();
</script>

<button class="button" onclick={(e) => onclick?.(e)}>
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger
        class={cn(
          'w-12 h-12 bg-slate-300 hover:bg-slate-400 transition-colors rounded flex justify-center items-center',
          className
        )}
      >
        {@render children?.()}
      </Tooltip.Trigger>
      <Tooltip.Content {side}>
        <p>{tooltip}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
</button>

<style>
  .button > :global(button) {
    background: var(--bg);
  }

  .button > :global(button):hover {
    background: var(--hover-bg, --bg);
  }
</style>
