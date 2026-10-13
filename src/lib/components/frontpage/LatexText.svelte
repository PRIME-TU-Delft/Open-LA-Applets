<script lang="ts">
  import katex from 'katex';
  import 'katex/dist/katex.min.css';

  type Props = {
    text: string;
  };

  let { text }: Props = $props();

  function renderLatex(text: string): string {
    return text
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, equation: string) =>
        katex.renderToString(equation, {
          displayMode: true,
          throwOnError: false
        })
      )
      .replace(/\$([^$]+?)\$/g, (_, equation: string) =>
        katex.renderToString(equation, {
          displayMode: false,
          throwOnError: false
        })
      );
  }

  let rendered = $derived(renderLatex(text));
</script>

<span class="inline">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html rendered}
</span>
