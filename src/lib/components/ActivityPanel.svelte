<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { isActive } from '$lib/stores/activityStore';
  import { isInset } from '$lib/stores/globalStateStore';
  import { mdiPause } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div
  class="flex gap-1 hover:scale-105 text-blue-900 scale-100 transition-transform backdrop-blur-md bg-blue-200/70 shadow-md rounded-lg absolute bottom-2 left-1/2 -translate-x-1/2 items-center"
  class:m-2={$isInset}
>
  {#if !$isActive}
    <div class="px-2 py-1 relative sm:text-nowrap text-balance text-center">
      Click anywhere in the scene to start interacting
      <span class="absolute -right-1 -top-1 flex h-3 w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
        />
        <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
      </span>
    </div>
  {:else}
    <button class="px-2 py-1" on:click={() => dispatch('pause')}>
      <Dialog.Root>
        <Dialog.Trigger class="rounded-sm bg-blue-200 hover:bg-blue-300 transition-colors">
          <Button.Action class="w-6 h-6" icon={mdiPause} tooltip="Pause scene" />
        </Dialog.Trigger>
      </Dialog.Root>

      Pause the scene
    </button>
  {/if}
</div>
