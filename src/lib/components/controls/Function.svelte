<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { Function } from '$lib/controls/Function.svelte';
  import * as TextInput from '$lib/components/ui/textinput/index.js';
  import Latex from '../Latex.svelte';

  type FunctionProps = {
    func: Function;
  };

  let { func }: FunctionProps = $props();
</script>

{#if func.label}
  <Latex latex={func.label + ':'} color={func.color.toString()} />
{/if}

<TextInput.Root aria-invalid={func.isError} bind:value={func.functionString} />
