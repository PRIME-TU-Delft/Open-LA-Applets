<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { Function } from '$lib/controls/Function.svelte';
  import * as TextInput from '$lib/components/ui/textinput/index.js';
  import LatexUI from '$lib/components/Latex.svelte';

  type FunctionProps = {
    func: Function;
  };

  let { func }: FunctionProps = $props();
</script>

<LatexUI latex={func.label} color={func.color.toString()} />

{#if func.isError}
  <span>err</span>
{/if}

<TextInput.Root bind:value={func.functionString} />
