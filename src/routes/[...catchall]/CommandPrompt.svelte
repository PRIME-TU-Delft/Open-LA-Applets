<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/Icon.svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import { mdiArrowRight, mdiEye, mdiEyeOff, mdiFile } from '@mdi/js';
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';

  export let fileUrls: string[];

  let open = false;
  let showPreview = false;

  interface File {
    file: string;
    folder: string;
    url: string;
  }

  let openApplets = new Set<string>([]);

  $: folders = fileUrls
    .map((fileUrl) => {
      const parts = fileUrl.split('/');
      const file = parts.pop() || '';
      const folder = parts.join('/');

      return { file, folder };
    })
    .reduce((acc, curr) => {
      const file = {
        file: curr.file.replaceAll('_', ' '),
        folder: curr.folder,
        url: `/applet/${curr.folder}/${curr.file}`
      };

      if (curr.folder in acc) {
        acc[curr.folder].push(file);
      } else {
        acc[curr.folder] = [file];
      }
      return acc;
    }, {} as Record<string, File[]>);

  $: !open && (openApplets = new Set<string>([]));

  function selectPreviewApplet(file: File) {
    if (openApplets.has(file.file)) {
      openApplets.delete(file.file);
    } else {
      openApplets.add(file.file);
    }

    openApplets = new Set(openApplets);
  }

  function toggleShowPreview() {
    showPreview = !showPreview;

    openApplets = new Set<string>([]);
  }

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open = !open;
      }
    }

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<p class="text-sm text-muted-foreground">
  Press
  <kbd
    class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
  >
    <span class="text-xs">⌘</span>K
  </kbd>
  to search
</p>

<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List class={openApplets.size > 0 ? 'tall' : ''}>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Item value="show hide preview" onSelect={toggleShowPreview}>
      <Icon class="mx-2" path={showPreview ? mdiEyeOff : mdiEye} />
      <span>{showPreview ? 'Hide' : 'Show'} preview</span>
    </Command.Item>

    {#each Object.entries(folders) as [folderTitle, files]}
      <Command.Separator />

      <Command.Group heading={folderTitle}>
        {#each files as file}
          {#if showPreview}
            <Command.Item
              class="flex flex-col gap-3"
              value={folderTitle + ' ' + file.file}
              onSelect={() => selectPreviewApplet(file)}
            >
              <div class="flex w-full justify-between">
                <div class="flex">
                  <Icon path={mdiFile} />
                  <span>Go to {file.file}</span>
                </div>
                <Icon path={openApplets.has(file.file) ? mdiEyeOff : mdiEye} />
              </div>

              {#if openApplets.has(file.file)}
                <iframe
                  in:scale
                  title={file.file}
                  class="w-full h-96 bg-white rounded"
                  src={file.url + '?iframe=true'}
                  frameborder="0"
                  allowfullscreen
                />
              {/if}
            </Command.Item>
          {:else}
            <Command.Item
              class="flex justify-between"
              value={folderTitle + ' ' + file.file}
              onSelect={() => goto(file.url)}
            >
              <div class="flex">
                <Icon path={mdiFile} />
                <span>Go to {file.file}</span>
              </div>
              <Icon path={mdiArrowRight} />
            </Command.Item>
          {/if}
        {/each}
      </Command.Group>
    {/each}
  </Command.List>
</Command.Dialog>

<style>
  :global([data-cmdk-list]) {
    min-height: 300px;
    height: 30rem;
    max-height: 80vh;
    transition: height 100ms ease;
  }

  :global(.tall) {
    height: 60rem !important;
  }
</style>
