<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import { mdiArrowRight } from '@mdi/js';
  import Fuse from 'fuse.js';
  import { Icon } from 'mdi-svelte-ts';

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

  console.log(fileUrls);

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
  {#each searchedFiles as { item: file }}
    <a
      class="link-hover bg-base-300 rounded p-4 flex justify-between items-center hover:bg-primary focus:bg-primary"
      href={file.url}
    >
      <div class="flex gap-1">
        <div class="no-underline text-neutral-500">{formatString(file.folder)}</div>
        <div class="no-underline">/</div>
        <div>{formatString(file.file)}</div>
      </div>
      <Icon path={mdiArrowRight} />
    </a>
  {/each}
</div>

<style lang="postcss">
  .isActive {
    @apply bg-primary;
  }
</style>
