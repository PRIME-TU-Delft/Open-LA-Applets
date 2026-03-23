<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import * as Accordion from '$lib/components/ui/accordion';
  import ListItem from './ListItem.svelte';
  import Switch from '../ui/switch/switch.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  let showUnused: boolean = $state(false);

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

          if (showUnused || file.used) {
            if (curr.folder in acc) {
              acc[curr.folder].push(file);
            } else {
              acc[curr.folder] = [file];
            }
          }

          return acc;
        },
        {} as Record<string, File[]>
      )
  );
</script>

<div class="mx-auto my-10 flex flex-col">
  <div class="mb-2 self-end">
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <label for="show-unused-toggle">
            Show <span class="underline decoration-dotted">unused</span> applets
          </label>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>"Unused" applets are those that do not appear in the book.</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
    <Switch bind:checked={showUnused} id="show-unused-toggle" />
  </div>

  <Accordion.Root type="single" class="container mx-auto">
    {#each Object.entries(folders) as [folderTitle, files] (folderTitle)}
      <Accordion.Item value={folderTitle}>
        <Accordion.Trigger>{formatString(folderTitle)}</Accordion.Trigger>
        {#each files as { title, url, used } (url)}
          <Accordion.Content>
            <ListItem {title} {used} url={url as '/applet/${string}'} />
          </Accordion.Content>
        {/each}
      </Accordion.Item>
    {/each}
  </Accordion.Root>

  {#if Object.keys(folders).length === 0}
    <span>Oops, there are no applets...</span>
  {/if}
</div>
