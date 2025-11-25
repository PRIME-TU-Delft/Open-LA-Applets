<script lang="ts">
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import { _ } from 'svelte-i18n';
  import type { Function } from '$lib/controls/Function.svelte';
  import * as TextInput from '$lib/components/ui/textinput/index.js';
  import LatexUI from '$lib/components/Latex.svelte';

  type FunctionProps = {
    value: string;
    func: Function;
  };

  let { value = $bindable(), func }: FunctionProps = $props();

  let uuid = generateUUID();
</script>

<LatexUI latex={func.label} color={func.color.toString()} />

<TextInput.Root bind:value />
