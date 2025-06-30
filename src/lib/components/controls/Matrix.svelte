<script lang="ts">
  import type { Matrix } from '$lib/controls/Matrix.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Eye from 'lucide-svelte/icons/eye';
  import EyeOff from 'lucide-svelte/icons/eye-off';
  import Latex from '../Latex.svelte';

  const { controller }: { controller: Matrix } = $props();
</script>

<div class="flex items-center gap-1">
  <div class="flex flex-col items-center gap-1">
    {#if controller.label}
      <Latex
        latex={controller.label + ':'}
        color={controller.color +
          (controller.disabled ? PrimeColor.opacity(0.5) : PrimeColor.opacity(1))}
      />
    {/if}
    <button
      class="cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-center transition-colors hover:bg-gray-400"
      onclick={() => controller.toggleAvailability()}
    >
      {#if controller.disabled}
        <Eye class="size-3" />
      {:else}
        <EyeOff class="size-3" />
      {/if}
    </button>
  </div>

  <Latex
    latex="\Bigg["
    color={controller.disabled ? PrimeColor.black + PrimeColor.opacity(0.5) : '#000'}
  />
  <div class="grid max-w-28 grid-cols-2 gap-2 text-sm" class:disabled={controller.disabled}>
    <input
      type="number"
      class="w-full rounded-md bg-gray-200 p-1 text-center"
      disabled={controller.disabled}
      bind:value={controller.value.tl}
    />
    <input
      type="number"
      class="w-full rounded-md bg-gray-200 p-1 text-center"
      disabled={controller.disabled}
      bind:value={controller.value.tr}
    />
    <input
      type="number"
      class="w-full rounded-md bg-gray-200 p-1 text-center"
      disabled={controller.disabled}
      bind:value={controller.value.bl}
    />
    <input
      type="number"
      class="w-full rounded-md bg-gray-200 p-1 text-center"
      disabled={controller.disabled}
      bind:value={controller.value.br}
    />
  </div>
  <Latex
    latex="\Bigg]"
    color={controller.disabled ? PrimeColor.black + PrimeColor.opacity(0.5) : '#000'}
  />
</div>

<style>
  .disabled {
    opacity: 0.5;
  }
</style>
