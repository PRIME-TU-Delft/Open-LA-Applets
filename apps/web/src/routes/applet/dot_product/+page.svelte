<script lang="ts">
  import { Container } from 'ui';

  import { getParagraphs } from '$lib/chapters';
</script>

<div class="pt-20 pb-10">
  <Container>
    <h1 class="m-10 text-3xl">Applet chapters</h1>
  </Container>
</div>

<Container>
  <input class="rounded p-2" placeholder="search" />

  <!-- {chapters} -->

  <ul class="flex flex-col gap-4 py-5">
    {#each getParagraphs('Dot product') as paragraph}
      <li class="cursor-pointer rounded bg-gray-100 p-2 transition-colors hover:bg-gray-300">
        <a href={paragraph.url}>
          {paragraph.name}
        </a>
      </li>
    {/each}
  </ul>
</Container>
