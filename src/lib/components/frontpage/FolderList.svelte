<script lang="ts">
  import { formatString } from '$lib/utils/FormatString';
  import * as Accordion from '$lib/components/ui/accordion';
  import ListItem from './ListItem.svelte';
  import { onMount } from 'svelte';

  type AppletUsageEntry = {
    url: string;
    title: string;
    name: string;
    source_files: string[];
  };

  type BookAppletUsage = {
    applets: AppletUsageEntry[];
  };

  type AppletsUsageByBook = Record<string, BookAppletUsage>;

  let appletsUsage: AppletsUsageByBook | null = null;
  let usageLoaded = false;

  onMount(async () => {
    try {
      const res = await fetch('/book-applets.json', {
        cache: 'force-cache'
      });
      if (res.ok) {
        appletsUsage = await res.json();
        console.log({appletsUsage});
      }
    } finally {
      // Always mark as loaded so UI can render even if fetch fails.
      usageLoaded = true;
    }
  });

  export type FolderListProps = {
    fileUrls: string[];
    directory?: string;
    book?: string;
  };

  let { fileUrls, directory = '', book="Linear-Algebra" }: FolderListProps = $props();

  type File = {
    title: string;
    url: string;
    used: boolean;
  };

  let folders = $derived(
    usageLoaded
      ? fileUrls
          .map((fileUrl) => {
            const parts = fileUrl.split('/');
            const file = parts.pop() || '';
            const folder = parts.join('/');

            return { file, folder };
          })
          .reduce(
            (acc, curr) => {
              const route = `${directory}${curr.folder}/${curr.file}`;
              const usedApplets = appletsUsage?.[book]?.applets ?? [];
              const thisAppletUsage = usedApplets.find((e) => e.url === route);

              let file = {
                title: curr.file,
                url: `/applet/${route}`,
                used: false
              };

              if (thisAppletUsage) {
                file.used = true;
              }

              if (curr.folder in acc) {
                acc[curr.folder].push(file);
              } else {
                acc[curr.folder] = [file];
              }
              return acc;
            },
            {} as Record<string, File[]>
          )
      : ({} as Record<string, File[]>)
  );
</script>

<Accordion.Root type="single" class="container mx-auto my-10">
  {#each Object.entries(folders) as [folderTitle, files], index (folderTitle)}
    <Accordion.Item value="item-{index}">
      <Accordion.Trigger>{formatString(folderTitle)}</Accordion.Trigger>
      {#each files as { title, url, used } (url)}
        <Accordion.Content>
          <ListItem title={title + (used ? "" : "\t not used")} url={url as '/applet/${string}'} />
        </Accordion.Content>
      {/each}
    </Accordion.Item>
  {/each}
</Accordion.Root>
