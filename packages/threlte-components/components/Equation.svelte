<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import { HTML } from '@threlte/extras';
  export let s: string = `no equation`;
  export let color: string = 'green';

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

<HTML>
  <div style="color: {color}">{@html str}</div>
</HTML>
