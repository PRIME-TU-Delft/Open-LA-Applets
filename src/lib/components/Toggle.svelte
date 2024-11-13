<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import type { Toggle } from '$lib/controls/Toggle.svelte';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';

  type ToggleProps = {
    toggle: Toggle;
    value: boolean;
  };

  let { toggle, value = $bindable() }: ToggleProps = $props();
  let uuid = generateUUID();
</script>

<div class="p-1.5 flex items-center gap-1">
  {#if toggle.label != undefined}
    <Label class="inline-flex items-center" for="checkbox-{uuid}">
      <Latex latex={toggle.label} color={toggle.color} />:
    </Label>
  {/if}

  <Checkbox --bg={toggle.color} id="checkbox-{uuid}" bind:checked={value} />
</div>
