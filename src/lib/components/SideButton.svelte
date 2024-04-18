<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Button from '$lib/components/ui/button';
  import { mdiRestart } from '@mdi/js';
  import { cn } from '$lib/utils';

  export let tooltip: string;
  export let translateX: string;

  $: classes = cn(
    'resetButton absolute top-1/2 -translate-y-1/2 z-[-1] transition-all',
    translateX
  );
</script>

<div class={classes}>
  <Dialog.Root>
    <Dialog.Trigger
      class="rounded-xl backdrop-blur-sm bg-blue-300/70 hover:bg-blue-400/70 transition-colors"
    >
      <Button.Action on:click class="w-16 h-8 flex gap-0.5" icon={mdiRestart} {tooltip}>
        <slot />
      </Button.Action>
    </Dialog.Trigger>
  </Dialog.Root>
</div>
