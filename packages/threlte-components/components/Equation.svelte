<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import { HTML } from '@threlte/extras';
  import { Vector3 } from 'three';

  export let s: string = `no equation`;
  export let color: string = 'green';
  export let position: Vector3 = new Vector3(0, 0, 0);

  let str = '';

  onMount(() => {
    // For reference: https://katex.org/docs/options.html
    str = katex.renderToString(s, {
      displayMode: true,
      leqno: false,
      fleqn: false,
      throwOnError: true,
      errorColor: '#cc0000',
      strict: 'warn',
      output: 'mathml',
      trust: false,
      macros: { '\\f': '#1f(#2)' }
    });
  });
</script>

<HTML {position}>
  <div class="equation" style="color: {color}">{@html str}</div>
</HTML>

<style>
  .equation {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }
</style>
