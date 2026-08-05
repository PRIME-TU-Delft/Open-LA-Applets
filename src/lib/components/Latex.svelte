<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { cn } from '$lib/utils/shadcn-utils';
  import katex from 'katex';

  type LatexProps = {
    latex: string;
    params?: (string | number)[];
    colors?: string[];
    color?: string;
    outputType?: 'html' | 'mathml' | 'htmlAndMathml';
    class?: string;
    fontSize?: number;
    style?: string;
    compact?: boolean;
  };

  let {
    latex = '',
    params = [],
    colors = PrimeColor.asArray(),
    color = 'black',
    outputType = 'html',
    class: classes = '',
    fontSize = 1,
    style = '',
    compact = false
  }: LatexProps = $props();

  let strOutput = $derived.by(() => {
    let input = latex;

    try {
      // Replace the parameters in the string with the values given by the user
      for (let i = 0; i < params.length; i++) {
        const value = parseFloat('' + params[i]).toFixed(2) || params[i];

        input = input.replaceAll('\\$' + i, `\\textcolor{${colors[i % colors.length]}}{${value}}`);
      }

      // For reference: https://katex.org/docs/options.html
      const results = katex.renderToString(input, {
        displayMode: true,
        leqno: false,
        fleqn: false,
        throwOnError: true,
        output: outputType,
        trust: true,
        strict: false
      });

      return results;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return e.message;
    }
  });

  let latexClasses = $derived(cn('latex select-none', classes));

  let strOutputFinal = $derived(
    compact ? strOutput.replace('class="katex"', 'class="katex" style="line-height:0"') : strOutput
  );
</script>

<div style={`font-size: ${fontSize}rem; color: ${color};` + style} class={latexClasses}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html strOutputFinal}
</div>
