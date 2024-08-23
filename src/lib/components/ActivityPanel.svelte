<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { activityState } from '$lib/stores/activity.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { Lock, Unlock } from 'lucide-svelte';

  type ActivityPanelProps = {
    onLock: (event: MouseEvent) => void;
  };

  let { onLock }: ActivityPanelProps = $props();
</script>

<div
  class="flex gap-1 hover:scale-105 text-blue-900 scale-100 transition-transform backdrop-blur-md bg-blue-200/70 shadow-md rounded-lg absolute bottom-2 left-1/2 -translate-x-1/2 items-center"
  class:m-2={globalState.isInset()}
>
  {#if !activityState.isActive}
    <div class="px-4 py-1 relative sm:text-nowrap text-balance text-center items-center flex gap-2">
      <Button.Action class="w-6 h-6" tooltip="Lock scene">
        <Unlock class="bg-blue-200 hover:bg-blue-300 p-1 w-6 h-6 rounded-sm transition-colors" />
      </Button.Action>
      Click anywhere in the scene to start interacting
      <span class="absolute -right-1 -top-1 flex h-3 w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
      </span>
    </div>
  {:else}
    <button class="px-1 py-1" onclick={(e) => onLock(e)}>
      <Dialog.Root>
        <Dialog.Trigger class="rounded-sm bg-blue-200 hover:bg-blue-300 transition-colors">
          <Button.Action class="w-6 h-6" tooltip="Lock scene">
            <Lock class="w-4 h-4 pt-0.5" />
          </Button.Action>
        </Dialog.Trigger>
      </Dialog.Root>

      Lock the scene to disable zoom
    </button>
  {/if}
</div>
