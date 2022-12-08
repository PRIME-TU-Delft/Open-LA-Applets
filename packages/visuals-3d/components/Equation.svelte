<script lang="ts">
  import { onMount } from 'svelte';
  export let s = `no equation`;

  onMount(() => {
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    document.head.append(script);

    script.onload = () => {
      let MathJax = {
        tex: {
          inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
          ]
        },
        svg: { fontCache: 'global' }
      };

      console.log(MathJax);
    };
  });
</script>

<p>{s}</p>
