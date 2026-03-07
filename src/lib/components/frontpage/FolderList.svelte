<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import * as Accordion from '$lib/components/ui/accordion';
  import ListItem from './ListItem.svelte';

  type AppletUsageEntry = {
    url: string;
    title: string;
    name: string;
    source_files: string[];
  };

  type BookAppletUsage = {
    applets: AppletUsageEntry[];
  };

  export type FolderListProps = {
    fileUrls: string[];
    directory?: string;
    appletUsageInBook: BookAppletUsage;
  };

  let { fileUrls, directory = '', appletUsageInBook }: FolderListProps = $props();

  type File = {
    title: string;
    url: string;
    used: boolean;
  };

  let folders = $derived(
    fileUrls
      .map((fileUrl) => {
        const parts = fileUrl.split('/');
        const file = parts.pop() || '';
        const folder = parts.join('/');

        return { file, folder };
      })
      .reduce(
        (acc, curr) => {
          const route = `${directory}${curr.folder}/${curr.file}`;
          const usedApplets = appletUsageInBook?.applets ?? [];
          const thisAppletUsage = usedApplets.find((e) => e.url === route);

          let file = {
            title: curr.file,
            url: `/applet/${route}`,
            used: thisAppletUsage != undefined || appletUsageInBook == undefined // if appletUsageInBook is undefined, then loading the usage file failed
          };

          if (curr.folder in acc) {
            acc[curr.folder].push(file);
          } else {
            acc[curr.folder] = [file];
          }
          return acc;
        },
        {} as Record<string, File[]>
      )
  );
</script>

<Accordion.Root type="single" class="container mx-auto my-10">
  {#each Object.entries(folders) as [folderTitle, files], index (folderTitle)}
    <Accordion.Item value="item-{index}">
      <Accordion.Trigger>{formatString(folderTitle)}</Accordion.Trigger>
      {#each files as { title, url, used } (url)}
        <Accordion.Content>
          <ListItem {title} {used} url={url as '/applet/${string}'} />
        </Accordion.Content>
      {/each}
    </Accordion.Item>
  {/each}
</Accordion.Root>
