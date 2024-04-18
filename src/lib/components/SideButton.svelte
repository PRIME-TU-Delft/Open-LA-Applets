<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
  import { mdiRestart } from '@mdi/js';

  export let tooltip: string;
  export let translate: string;
  let classes: string = '';
  export { classes as class };

  $: outerClasses = cn(
    'absolute top-1/2 -translate-y-1/2 z-[-1] motion-safe:transition-all rounded-lg backdrop-blur-sm bg-blue-200/80 hover:bg-blue-300/80',
    translate
  );
  $: innerClasses = cn('w-16 h-8 flex gap-0.5 text-blue-900', classes);
</script>

<div class={outerClasses}>
  <Button.Action on:click class={innerClasses} icon={mdiRestart} {tooltip}>
    <slot />
  </Button.Action>
</div>
