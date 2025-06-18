<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Command from '$lib/components/ui/command/index.js';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Cross from '@lucide/svelte/icons/cross';
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import File from '@lucide/svelte/icons/file';
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';

  type CommandPromptProps = {
    fileUrls: string[];
  };

  let { fileUrls }: CommandPromptProps = $props();

  let open = $state(false);
  let showPreview = $state(false);

  interface Applet {
    file: string;
    folder: string;
    url: string;
  }

  let openApplets = $state(new Set<string>([]));

  const folders = $derived(
    fileUrls
      .map((fileUrl) => {
        const parts = fileUrl.split('/');
        const file = parts.pop() || '';
        const folder = parts.join('/');

        return { file, folder };
      })
      .reduce(
        (acc, curr) => {
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
        },
        {} as Record<string, Applet[]>
      )
  );

  function reset() {
    showPreview = false;
    openApplets = new Set<string>([]);
  }

  $effect(() => {
    if (!open) reset();
  });

  function selectPreviewApplet(file: Applet) {
    if (openApplets.has(file.file)) {
      openApplets.delete(file.file);
    } else {
      openApplets.add(file.file);
    }

    openApplets = new Set(openApplets);
  }

  function selectPreviewAppletFolder(files: Applet[]) {
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

<p class="text-sm text-blue-950">
  Press
  <kbd
    class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
  >
    <span class="text-xs">⌘/Ctrl</span>K
  </kbd>
  to search
</p>

<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List class={openApplets.size > 0 ? 'tall' : ''}>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Item value="show hide preview" onSelect={toggleShowPreview}>
      <!-- <Icon class="mx-2" path={showPreview ? mdiFileOutline : mdiEye} /> -->
      {#if showPreview}
        <File class="mx-2" />
      {:else}
        <Eye class="mx-2" />
      {/if}
      <span>{showPreview ? 'Go to' : 'Preview'} mode</span>
    </Command.Item>

    {#if openApplets.size > 0}
      <Command.Item value="close all previews" onSelect={() => (openApplets = new Set([]))}>
        <Cross class="mx-2" />
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
            <div class="flex w-full justify-start gap-2">
              {#if hasAllPreviewed}
                <EyeOff class="mx-2" />
              {:else}
                <Eye class="mx-2" />
              {/if}
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
              <div class="flex w-full justify-start gap-2">
                {#if isPreviewed}
                  <EyeOff class="mx-2" />
                {:else}
                  <Eye class="mx-2" />
                {/if}
                <span>Preview {file.file}</span>
              </div>

              {#if isPreviewed}
                <iframe
                  in:scale
                  title={file.file}
                  class="h-96 w-full rounded bg-white"
                  src={file.url + '?iframe=true'}
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              {/if}
            </Command.Item>
          {:else}
            <Command.Item
              class="flex justify-between"
              value={folderTitle + ' ' + file.file}
              onSelect={() => goto(file.url)}
            >
              <div class="flex gap-2">
                <File class="mx-2" />
                <span>Go to {file.file} applet</span>
              </div>

              <ArrowRight class="mx-2" />
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
