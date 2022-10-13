<script lang="ts">
  import { Container } from 'ui';

  import { getParagraphs } from '$lib/chapters';
</script>

<div class="pt-20 pb-10">
  <Container>
    <h1 class="text-3xl m-10">Applet chapters</h1>
  </Container>
</div>

<Container>
  <input class="p-2 rounded" placeholder="search" />

  <!-- {chapters} -->

  <ul class="flex flex-col py-5 gap-4">
    {#each getParagraphs('Lines and Planes') as paragraph}
      <li class="p-2 rounded transition-colors cursor-pointer bg-gray-100 hover:bg-gray-300">
        <a href="{paragraph.url}">
          {paragraph.name}
        </a>
      </li>
    {/each}
  </ul>
</Container>
