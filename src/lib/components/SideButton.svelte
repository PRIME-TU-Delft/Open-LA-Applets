<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import { cn } from '$lib/utils/shadcn-utils';
  import type { Snippet } from 'svelte';

  type SideButtonProps = {
    tooltip: string;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  };

  let {
    tooltip = '',
    class: classes = '',
    onclick = () => {},
    children
  }: SideButtonProps = $props();

  const outerClasses = $derived(
    cn(
      'scale-100 hover:scale-105 motion-safe:transition-all rounded-lg backdrop-blur-sm bg-blue-200/80 hover:bg-blue-300/80'
    )
  );
  const innerClasses = $derived(cn('w-auto px-2 h-8 flex gap-0.5 text-blue-900', classes));
</script>

<div class={outerClasses}>
  <Button.Action onclick={(e) => onclick(e)} class={innerClasses} {tooltip} side="top">
    {@render children()}
  </Button.Action>
</div>
