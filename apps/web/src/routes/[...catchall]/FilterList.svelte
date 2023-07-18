<script lang="ts">
  import { mdiClose } from '@mdi/js';
  import Fuse from 'fuse.js';
  import { Icon } from 'mdi-svelte-ts';
  import ListItem from './ListItem.svelte';

  export let fileUrls: string[];
  export let searchQuery: string;

  interface File {
    file: string;
    folder: string;
    url: string;
  }

  $: fileList = fileUrls.map((fileUrl) => {
    const parts = fileUrl.split('/');
    const file = parts.pop() || '';
    const folder = parts.join('/');
    const url = `/applet/${folder}/${file}`;

    return { file, folder, url };
  });

  const fuseOptions = {
    includeScore: true,
    keys: ['file', 'folder']
  };

  $: fuse = new Fuse(fileList, fuseOptions);

  let searchedFiles: Fuse.FuseResult<File>[] = [];

  $: if (searchQuery) {
    searchedFiles = fuse.search(searchQuery);
  }
</script>

<div class="flex flex-col gap-1 container my-10 mx-auto">
  {#each searchedFiles as { item: file } (file.url)}
    <ListItem url={file.url} title={file.file} />
  {:else}
    <div
      class="container my-10 mx-auto h-96 flex flex-col gap-2 items-center justify-center bg-base-200 border border-base-300 rounded-lg"
    >
      <div class="text-2xl text-center">
        No results found for <span class="font-bold">{searchQuery}</span>
      </div>
      <button class="btn btn-primary" on:click={() => (searchQuery = '')}>
        <Icon path={mdiClose} />
        Clear search
      </button>
    </div>
  {/each}
</div>
