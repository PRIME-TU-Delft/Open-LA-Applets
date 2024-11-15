<script lang="ts">
  import type { SortableMatrix } from '$lib/controls/SortableMatrix.svelte';
  import Matrix from './Matrix.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { ArrowLeftRight } from 'lucide-svelte';

  const { controller }: { controller: SortableMatrix } = $props();

  function switchPositions(i1: number, i2: number): any {
    const temp = controller.value[i2];
    controller.value[i2] = controller.value[i1];
    controller.value[i1] = temp;
  }
</script>

<div class="flex items-center">
  {#each controller.value as index, i}
    {#if i > 0}
      <button
        onclick={() => switchPositions(i, i - 1)}
        class="size-8 mx-1 rounded-lg p-2"
        style="background: {PrimeColor.yellow}"
      >
        <ArrowLeftRight class="size-4" />
      </button>
    {/if}

    <Matrix controller={controller.matrices[index]} />
  {/each}
</div>
