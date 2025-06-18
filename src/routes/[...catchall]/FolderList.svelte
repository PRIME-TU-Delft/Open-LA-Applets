<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import * as Accordion from '$lib/components/ui/accordion';
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
    .reduce(
      (acc, curr) => {
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
      },
      {} as Record<string, File[]>
    );
</script>

<Accordion.Root type="single" class="container mx-auto my-10">
  {#each Object.entries(folders) as [folderTitle, files], index (folderTitle)}
    <Accordion.Item value="item-{index}">
      <Accordion.Trigger>{formatString(folderTitle)}</Accordion.Trigger>
      {#each files as { title, url } (url)}
        <Accordion.Content>
          <ListItem {title} {url} />
        </Accordion.Content>
      {/each}
    </Accordion.Item>
  {/each}
</Accordion.Root>
