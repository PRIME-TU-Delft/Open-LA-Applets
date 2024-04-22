<script lang="ts">
  import katex from 'katex';
  import { HTML } from '@threlte/extras';
  import { Vector3 } from 'three';

  export let latex = '';
  export let color = 'black';
  export let position = new Vector3(0, 0, 0);
  export let size = 1;
  export let offset = 0.25;
  export let hasBackground = false;

  let str = '';

  // Add offset in the direction of the vector
  $: pos = position.clone().add(position.clone().normalize().multiplyScalar(offset));

  $: {
    // Render the LaTeX string given by the user to a MathML string
    // using KaTeX. If KaTeX throws an error, return the error message instead.
    // The code is wrapped in a try-catch block to ensure that no errors
    // are thrown.

    try {
      // For reference: https://katex.org/docs/options.html
      str = katex.renderToString(latex, {
        displayMode: false,
        leqno: false,
        fleqn: false,
        throwOnError: true,
        errorColor: '#cc0000',
        strict: 'warn',
        output: 'html',
        trust: true,
        macros: { '\\f': '#1f(#2)' }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      str = e.message;
    }
  }
</script>

<HTML center occlude position={[pos.x, pos.y, pos.z]} pointerEvents="none">
  <div
    class="select-none pointer-events-none"
    class:hasBackground
    style="color: {color}; font-size: {size}rem;"
  >
    <!-- html insertion is allowed because data is never modified by end-user -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html str}
  </div>
</HTML>

<style lang="postcss">
  .hasBackground {
    @apply px-1 rounded-lg bg-slate-50/30 backdrop-blur-sm;
  }
</style>
