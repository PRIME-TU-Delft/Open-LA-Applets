<script lang="ts">
  import katex from 'katex';
  import { HTML } from '@threlte/extras';
  import { Vector3 } from 'three';

  export let latex = '';
  export let color = 'black';
  export let position = new Vector3(0, 0, 0);
  export let size = 1;
  export let offset = 0.25;

  let str = '';

  // Add offset in the direction of the vector
  $: pos =
    offset == 0
      ? position
      : position.clone().add(position.clone().normalize().multiplyScalar(offset));

  $: {
    // Render the LaTeX string given by the user to a MathML string
    // using KaTeX. If KaTeX throws an error, return the error message instead.
    // The code is wrapped in a try-catch block to ensure that no errors
    // are thrown.

    try {
      // For reference: https://katex.org/docs/options.html
      str = katex.renderToString(latex, {
        displayMode: true,
        leqno: false,
        fleqn: false,
        throwOnError: true,
        errorColor: '#cc0000',
        strict: 'warn',
        output: 'html',
        trust: true,
        macros: { '\\f': '#1f(#2)' }
      });
    } catch (e: any) {
      str = e.message;
    }
  }
</script>

<HTML position={pos}>
  <!-- Mousedown|preventDefault is here to stop user with interacting with labels via the mouse (i.e. dragging) -->
  <div on:mousedown|preventDefault class="latex" style="color: {color}; font-size: {size}rem">
    {@html str}
  </div>
</HTML>

<style>
  .latex {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    user-select: none;
    pointer-events: none;
  }
</style>
