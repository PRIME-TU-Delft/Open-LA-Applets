<script lang="ts">
  /**
   * This component colors a certain part (the subsitution) of a string a specific color.
   * This is mainly used to visulatise a formula in the information pane UI. In a canvas
   */

  import { beforeUpdate } from 'svelte';
  import { PrimeColor } from '../utils/primeColors';

  export let color: PrimeColor = PrimeColor.yellow;
  export let param: any;
  export let formula = '';
  export let subsitution = '_';

  interface Block {
    type: 'text' | 'param';
    value: string;
  }

  let blocks: Block[] = [];

  /**
   * Recursive function that takes the formula of the sting and compares the first caracter each time it is called.
   * When te first caracter is equal to the subsitution, it will add a block of type 'param' to the blocks array.
   * When the formula is emty it will return the blocks array.
   */
  function calculateFormula(form: string[], result: Block[]) {
    if (form.length == 0) return result;

    const s = form.shift();

    if (s == subsitution) {
      result.push({ type: 'param', value: JSON.stringify(param) });
    } else if (result.length == 0) {
      result.push({ type: 'text', value: s });
    } else if (result[result.length - 1]) {
      const lastBlock = result[result.length - 1];
      const lastType = lastBlock.type;

      if (lastType == 'text') {
        lastBlock.value += s;
      } else {
        result.push({ type: 'text', value: s });
      }
    } else {
      // TODO: return error
      console.log('error', result[result.length - 1]);
    }

    // recursively call the function again with form minus the first element, and newly added results array
    return calculateFormula(form, result);
  }

  beforeUpdate(() => {
    blocks = calculateFormula(formula.split(''), [] as Block[]);
  });
</script>

<div class="text-right">
  {#each blocks as block}
    {#if block.type == 'text'}
      {block.value}
    {:else}
      <span style="color: {color}">{block.value}</span>
    {/if}
  {/each}
</div>
