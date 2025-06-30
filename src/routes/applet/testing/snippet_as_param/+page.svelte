<script lang="ts">
  import { snippetFormatter } from '$lib/utils/SnippetFormatter';

  let formatted = snippetFormatter<[number, string]>(draw, [, () => 'pink']);

  let value = 42;
</script>

{@render draw(0, 'orange')}
{@render draw()}

{@render formatted(value)}

{#snippet draw(value: number = 12, color: string = 'lightgreen')}
  <p>
    value:
    <span style="background:{color}">
      {value}
    </span>
  </p>
{/snippet}

<input type="number" bind:value />
