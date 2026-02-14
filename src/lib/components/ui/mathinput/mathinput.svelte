<script lang="ts">
  import 'mathlive';
  import 'mathlive/static.css';
  import type { MathfieldElement, MathfieldElementAttributes } from 'mathlive';
  import { on } from 'svelte/events';

  type Props = { value: string; error?: boolean } & Partial<MathfieldElementAttributes>;

  let { value = $bindable(), error = false, ...rest }: Props = $props();

  const init = (node: MathfieldElement) => {
    $effect(() => {
      if (value) node.value = value;
    });
    $effect(() => {
      return on(node, 'input', () => {
        value = node.value;
      });
    });
  };
</script>

<div class={error ? 'rounded-sm border-2 border-red-400' : 'rounded-sm border-2'}>
  <math-field use:init {...rest}></math-field>
</div>

<style>
  /* Hide the virtual keyboard toggle */
  math-field::part(virtual-keyboard-toggle) {
    display: none;
  }

  /* Hide the menu toggle */
  math-field::part(menu-toggle) {
    display: none;
  }
</style>
