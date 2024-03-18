<script>
  import Icon from '$lib/components/Icon.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';

  export let icon = '';
  export let tooltip = '';
</script>

<Tooltip.Root on:click>
  <Tooltip.Trigger
    class="w-12 h-12 bg-slate-300 hover:bg-slate-400 transition-colors rounded flex justify-center items-center"
  >
    <slot>
      <Icon path={icon} />
    </slot>
  </Tooltip.Trigger>
  <Tooltip.Content side="left" transitionConfig={{ x: 5, duration: 100 }}>
    <p>{tooltip}</p>
  </Tooltip.Content>
</Tooltip.Root>
