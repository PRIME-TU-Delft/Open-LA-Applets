<script lang="ts">
  import { primeColorArray } from '$lib/utils/PrimeColors';
  import { convertLatex } from '$lib/utils/LatexFormat';

  export let latex = '';
  export let params: (string | number)[] = [];
  export let colors: string[] = primeColorArray;

  $: str = convertLatex(latex, params, colors);
</script>

<div class="latex">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html str}
</div>
