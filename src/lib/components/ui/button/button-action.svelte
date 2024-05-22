<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { cn } from '$lib/utils';

  export let icon = '';
  export let tooltip = '';
  export let side: 'top' | 'right' | 'bottom' | 'left' = 'left';

  let className = '';
  export { className as class };
</script>

<button on:click>
  <Tooltip.Root openDelay={300} closeDelay={50}>
    <Tooltip.Trigger
      class={cn(
        'w-12 h-12 bg-slate-300 hover:bg-slate-400 transition-colors rounded flex justify-center items-center',
        className
      )}
      style="background: var(--bg)"
    >
      <slot>
        <Icon path={icon} />
      </slot>
    </Tooltip.Trigger>
    <Tooltip.Content {side} transitionConfig={{ x: 5, duration: 100 }}>
      <p>{tooltip}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</button>
