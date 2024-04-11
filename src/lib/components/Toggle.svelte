<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import type { Toggle } from '$lib/utils/Toggle';
  import { generateUUID } from 'three/src/math/MathUtils';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';

  let uuid = generateUUID();

  export let toggle: Toggle;
</script>

{#if toggle.label != undefined}
  <Label class="inline-flex items-center" for="checkbox-{uuid}">
    <Latex latex={toggle.label} />:
  </Label>
{/if}

<Checkbox id="checkbox-{uuid}" bind:checked={toggle.value} />
