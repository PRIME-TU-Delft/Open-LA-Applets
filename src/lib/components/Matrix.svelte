<script lang="ts">
  import type { Matrix } from '$lib/controls/Matrix.svelte';
  import { Eye, EyeOff } from 'lucide-svelte';
  import Latex from './Latex.svelte';

  const { controller }: { controller: Matrix } = $props();
</script>

<div class="flex gap-1 items-center">
  <div class="flex gap-1 flex-col items-center">
    {#if controller.label}
      <Latex latex={controller.label + ':'} />
    {/if}
    <button
      class="py-1 px-2 text-center bg-gray-200 hover:bg-gray-400 transition-colors rounded-md cursor-pointer"
      onclick={() => controller.toggleAvailability()}
    >
      {#if controller.disabled}
        <Eye class="size-3" />
      {:else}
        <EyeOff class="size-3" />
      {/if}
    </button>
  </div>

  <Latex latex="\Bigg[" />
  <div class="grid grid-cols-2 gap-2 max-w-28 text-sm" class:disabled={controller.disabled}>
    <input
      type="number"
      class="w-full p-1 text-center bg-gray-200 rounded-md"
      disabled={controller.disabled}
      bind:value={controller.value.tl}
    />
    <input
      type="number"
      class="w-full p-1 text-center bg-gray-200 rounded-md"
      disabled={controller.disabled}
      bind:value={controller.value.tr}
    />
    <input
      type="number"
      class="w-full p-1 text-center bg-gray-200 rounded-md"
      disabled={controller.disabled}
      bind:value={controller.value.bl}
    />
    <input
      type="number"
      class="w-full p-1 text-center bg-gray-200 rounded-md"
      disabled={controller.disabled}
      bind:value={controller.value.br}
    />
  </div>
  <Latex latex="\Bigg]" />
</div>

<style>
  .disabled {
    opacity: 0.5;
  }
</style>
