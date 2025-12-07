<script lang="ts">
  import 'mathlive';
  import 'mathlive/static.css';
  import type { MathfieldElement, MathfieldElementAttributes } from 'mathlive';
  import { on } from 'svelte/events';

  type Props = { value?: string } & Partial<MathfieldElementAttributes>;

  let { value = $bindable(), ...rest }: Props = $props();

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

<math-field use:init {...rest}></math-field>

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
