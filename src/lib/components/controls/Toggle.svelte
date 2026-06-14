<script lang="ts">
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';
  import type { Toggle } from '$lib/controls/Toggle.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import ControlLabel from './ControlLabel.svelte';

  type ToggleProps = {
    toggle: Toggle;
    value: boolean;
  };

  let { toggle, value = $bindable() }: ToggleProps = $props();
  let uuid = generateUUID();
</script>

<div class="flex items-center gap-1 p-1.5">
  {#if toggle.label != undefined}
    <Label class="inline-flex items-center" for="checkbox-{uuid}">
      <ControlLabel label={toggle.label + ':'} color={toggle.color} />
    </Label>
  {/if}

  <Checkbox
    id="checkbox-{uuid}"
    bind:checked={value}
    class="hover:bg-[var(--hover-bg)] data-[state=checked]:border-[var(--bg)] data-[state=checked]:bg-[var(--bg)]"
    style="--bg: {toggle.color}; --hover-bg: {toggle.color + PrimeColor.opacity(0.8)}"
  />
</div>
