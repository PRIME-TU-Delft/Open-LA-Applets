<script lang="ts">
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { activityState } from '$lib/stores/activity.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import Lock from '@lucide/svelte/icons/lock';
  import Unlock from '@lucide/svelte/icons/lock-open';

  type ActivityPanelProps = {
    onLock: (event: MouseEvent) => void;
  };

  let { onLock }: ActivityPanelProps = $props();
</script>

<div
  class="absolute bottom-2 left-1/2 flex -translate-x-1/2 scale-100 items-center gap-1 rounded-lg bg-blue-200/70 text-blue-900 shadow-md backdrop-blur-md transition-transform hover:scale-105"
  class:m-2={globalState.isInset()}
>
  {#if !activityState.isActive}
    <div class="relative flex items-center gap-2 px-4 py-1 text-center text-balance sm:text-nowrap">
      <Button.Action class="h-6 w-6" tooltip="Lock scene">
        <Unlock class="h-6 w-6 rounded-sm bg-blue-200 p-1 transition-colors hover:bg-blue-300" />
      </Button.Action>
      Click anywhere in the scene to start interacting
      <span class="absolute -top-1 -right-1 flex h-3 w-3">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"
        ></span>
        <span class="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
      </span>
    </div>
  {:else}
    <button class="px-1 py-1" onclick={(e) => onLock(e)}>
      <Dialog.Root>
        <Dialog.Trigger class="rounded-sm bg-blue-200 transition-colors hover:bg-blue-300">
          <Button.Action class="h-6 w-6" tooltip="Lock scene">
            <Lock class="h-4 w-4 pt-0.5" />
          </Button.Action>
        </Dialog.Trigger>
      </Dialog.Root>

      Lock the scene to disable zoom
    </button>
  {/if}
</div>
