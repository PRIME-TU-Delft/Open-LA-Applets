<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { Function } from '$lib/controls/Function.svelte';
  import Latex from '../Latex.svelte';
  import { MathInput } from '../ui/mathinput';

  type FunctionProps = {
    func: Function;
  };

  let { func }: FunctionProps = $props();

  function getRandomPlaceholder() {
    const placeholders = [
      '\\sin{(x)}',
      '\\cos{(x)}',
      'x^2 + 2x + 1',
      '\\sqrt{x + 2}',
      'e^{x}',
      '\\log_{2}{x}',
      '\\frac{1}{x}',
      '\\tan{(x)}',
      '|x-3|',
      '\\frac{\\sin{x}}{x}',
      '\\ln(x^2+1)',
      '\\max(x, 5)',
      '\\min(x^2, 10)',
      '\\sqrt[3]{x}',
      '\\arctan(x)',
      '\\exp(-x^2)',
      'x^{1/3}',
      '\\cosh(x)'
    ];

    return placeholders[Math.floor(Math.random() * placeholders.length)] + '\\; ...';
  }

  let placeholder = $state(getRandomPlaceholder());

  $effect(() => {
    if (!func.functionString) {
      placeholder = getRandomPlaceholder();
    }
  });
</script>

{#if func.label}
  <Latex latex={func.label + ':'} color={func.color.toString()} />
{/if}

<MathInput class="w-[150px]" {placeholder} error={func.isError} bind:value={func.functionString} />
