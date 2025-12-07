<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { Function } from '$lib/controls/Function.svelte';
  import Latex from '../Latex.svelte';
  import { MathInput } from '../ui/mathinput';

  type FunctionProps = {
    func: Function;
  };

  let { func }: FunctionProps = $props();
</script>

{#if func.label}
  <Latex latex={func.label + ':'} color={func.color.toString()} />
{/if}

<!-- TODO: aria-invalid -->
<MathInput aria-invalid={func.isError} bind:value={func.functionString} />
