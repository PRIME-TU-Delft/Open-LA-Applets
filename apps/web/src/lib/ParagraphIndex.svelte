<script lang="ts">
  import { Container } from 'ui';

  import { formatName, getChapterList } from '$lib/chapters';

  export let chapter = '';
  export let modules: Record<string, () => Promise<unknown>>;

  const list = getChapterList(modules, chapter);
</script>

<div class="pt-20 pb-10">
  <Container>
    <h1 class="m-10 text-3xl">Applet chapters / {formatName(chapter)}</h1>
  </Container>
</div>

<Container>
  <input class="rounded p-2" placeholder="search" />

  <ul class="flex flex-col gap-4 py-5">
    {#each list as item}
      <a href={item.url} class="capitalize">
        <li class="cursor-pointer rounded bg-gray-100 p-2 transition-colors hover:bg-gray-300">
          {item?.formatName || item.name}
        </li>
      </a>
    {/each}
  </ul>
</Container>
