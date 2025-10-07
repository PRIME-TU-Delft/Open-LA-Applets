<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';
  import type { Toggle } from '$lib/controls/Toggle.svelte';
  import { getLocalizedString } from '$lib/utils';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { locale } from 'svelte-i18n';
  import { generateUUID } from 'three/src/math/MathUtils.js';

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
      <Latex latex={getLocalizedString(toggle.label, $locale) || ''} color={toggle.color} />:
    </Label>
  {/if}

  <Checkbox
    --bg={toggle.color}
    --hover-bg={toggle.color + PrimeColor.opacity(0.8)}
    id="checkbox-{uuid}"
    bind:checked={value}
  />
</div>
