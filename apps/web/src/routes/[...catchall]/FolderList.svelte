<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import ListItem from './ListItem.svelte';

  export let fileUrls: string[];

  type File = {
    title: string;
    url: string;
  };

  $: folders = fileUrls
    .map((fileUrl) => {
      const parts = fileUrl.split('/');
      const file = parts.pop() || '';
      const folder = parts.join('/');

      return { file, folder };
    })
    .reduce((acc, curr) => {
      const file = {
        title: curr.file,
        url: `/applet/${curr.folder}/${curr.file}`
      };

      if (curr.folder in acc) {
        acc[curr.folder].push(file);
      } else {
        acc[curr.folder] = [file];
      }
      return acc;
    }, {} as Record<string, File[]>);
</script>

<div class="container my-10 mx-auto">
  {#each Object.entries(folders) as [folderTitle, files], index}
    <div class="prose collapse collapse-plus join-item bg-base-300 mt-4 p-4">
      <input type="radio" name="my-accordion-4" checked={index == 0} />
      <div class="collapse-title text-xl font-medium">{formatString(folderTitle)}</div>

      <div class="flex flex-col collapse-content gap-1">
        {#each files as { title, url }}
          <ListItem {title} {url} />
        {/each}
      </div>
    </div>
  {/each}
</div>
