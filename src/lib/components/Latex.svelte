<script lang="ts">
  import { primeColorArray } from '$lib/utils/PrimeColors';
  import { convertAndFormatLatex } from '$lib/utils/LatexFormat';

  export let latex = '';
  export let params: (string | number)[] = [];
  export let colors: string[] = primeColorArray;

  $: str = convertAndFormatLatex(latex, params, colors);
</script>

<div class="latex">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html str}
</div>
