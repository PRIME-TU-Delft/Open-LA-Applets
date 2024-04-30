<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/Icon.svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import { mdiArrowRight, mdiClose, mdiEye, mdiEyeOff, mdiFile, mdiFileOutline } from '@mdi/js';
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

  function reset() {
    showPreview = false;
    openApplets = new Set<string>([]);
  }

  $: !open && reset();

  function selectPreviewApplet(file: File) {
    if (openApplets.has(file.file)) {
      openApplets.delete(file.file);
    } else {
      openApplets.add(file.file);
    }

    openApplets = new Set(openApplets);
  }

  function selectPreviewAppletFolder(files: File[]) {
    const hasAll = files.every((file) => openApplets.has(file.file));

    if (hasAll) {
      files.forEach((file) => openApplets.delete(file.file));
    } else {
      files.forEach((file) => openApplets.add(file.file));
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
      <Icon class="mx-2" path={showPreview ? mdiFileOutline : mdiEye} />
      <span>{showPreview ? 'Go to' : 'Preview'} mode</span>
    </Command.Item>

    {#if openApplets.size > 0}
      <Command.Item value="close all previews" onSelect={() => (openApplets = new Set([]))}>
        <Icon class="mx-2" path={mdiClose} />
        <span>Close all previews</span>
      </Command.Item>
    {/if}

    {#each Object.entries(folders) as [folderTitle, files]}
      {@const hasAllPreviewed = files.every((file) => openApplets.has(file.file))}
      <Command.Separator />

      <Command.Group heading={folderTitle}>
        {#if showPreview && files.length > 1}
          <Command.Item
            class="flex flex-col gap-3"
            value={folderTitle}
            onSelect={() => selectPreviewAppletFolder(files)}
          >
            <div class="flex gap-2 justify-start w-full">
              <Icon path={hasAllPreviewed ? mdiEyeOff : mdiEye} />
              <span
                >{hasAllPreviewed ? 'Hide all previews' : 'Preview all applets'} from {folderTitle}</span
              >
            </div>
          </Command.Item>
        {/if}

        {#each files as file}
          {#if showPreview}
            {@const isPreviewed = openApplets.has(file.file)}
            <Command.Item
              class="flex flex-col gap-3"
              value={folderTitle + ' ' + file.file}
              onSelect={() => selectPreviewApplet(file)}
            >
              <div class="flex gap-2 justify-start w-full">
                <Icon path={isPreviewed ? mdiEyeOff : mdiEye} />
                <span>Preview {file.file}</span>
              </div>

              {#if isPreviewed}
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
              <div class="flex gap-2">
                <Icon path={mdiFileOutline} />
                <span>Go to {file.file} applet</span>
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
