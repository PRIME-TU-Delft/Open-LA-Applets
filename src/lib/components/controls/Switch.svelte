<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import type { Toggle } from '$lib/controls/Toggle.svelte';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '../ui/switch';
  import { getLocalizedString } from '$lib/utils';
  import { locale } from 'svelte-i18n';

  type ToggleProps = {
    switch: Toggle;
  };

  let { switch: toggle }: ToggleProps = $props();
  let uuid = generateUUID();
</script>

{#if toggle.label != undefined}
  <Label class="inline-flex items-center" for="checkbox-{uuid}">
    <Latex latex={getLocalizedString(toggle.label, $locale) || ''} />:
  </Label>
{/if}

<Switch id="switch-{uuid}" bind:checked={toggle.value as boolean} />

{#if toggle.switchRightSide != undefined}
  <Label class="inline-flex items-center" for="checkbox-{uuid}">
    <Latex latex={getLocalizedString(toggle.switchRightSide, $locale) || ''} />:
  </Label>
{/if}
