<script lang="ts">
  import { onMount } from 'svelte';
  import Fuse from 'fuse.js';
  import { mdiMagnify } from '@mdi/js';

  import Icon from '$lib/Icon.svelte';
  import LazyLoad from '$lib/LazyLoad.svelte';
  import Input from '$lib/Input.svelte';
  import Notification from '$lib/Notification.svelte';

  import debounce from '$lib/debounce';

  interface NamePath {
    name: string;
    path: string;
  }

  let page = 1;
  let mdiIcons: NamePath[] = [];
  let searchQuery = '';
  let searchedIcons: Fuse.FuseResult<NamePath>[] = [];

  const fuseOptions = {
    includeScore: true,
    keys: ['name', 'path']
  };

  $: fuse = new Fuse(mdiIcons, fuseOptions);

  // Copy <Icon {path} /> to clipboard
  function writeToClipboard(name: string) {
    const str = `<Icon path={${name}} />`;
    navigator.clipboard.writeText(str);
  }

  /**
   * Reset fuse and it's results
   */
  function resetSearch() {
    const f = new Fuse(mdiIcons, fuseOptions);
    searchedIcons = f.search('mdi');
  }

  const seachDebounce = debounce(() => (searchedIcons = fuse.search(searchQuery)));

  function handleKeyup(e: KeyboardEvent) {
    const key = e.key;

    // Do nothing if modifier keys are pressed
    if (key in new Set(['Meta', 'Control', 'Shift', 'Alt', 'Space'])) return;

    page = 1; // reset page count

    // Reset search if no query | otherwise search with debounce
    if (searchedIcons) seachDebounce();
    else resetSearch();
  }

  onMount(async () => {
    // Fetch all 7000+ icons
    const mdi = await import('@mdi/js');

    // Create an array of all icons
    const mdiArray = Object.entries(mdi) as [string, string][];
    mdiIcons = mdiArray.map(([name, path]) => ({ name, path }));

    // Search for all icons (Lazy loaded)
    resetSearch();
  });
</script>

<Notification let:writeMessage>
  <div class="container mx-auto my-12 max-w-6xl p-4">
    <Input bind:value={searchQuery} on:keyup={handleKeyup}>
      <span class="flex items-center gap-2">
        <span>{searchedIcons.length} icons</span>
        <Icon path={mdiMagnify} size={1.5} />
      </span>
    </Input>

    <div class="mt-1 text-sm text-gray-400">Click on an icon to copy to clipboard</div>

    <div class="icons my-4 grid gap-4">
      <LazyLoad items={searchedIcons} bind:page let:item let:index>
        <div
          class="flex cursor-pointer flex-col items-center gap-2 truncate rounded bg-slate-100 px-2 py-4 text-sm transition-colors hover:bg-slate-50"
          on:click={() => {
            writeToClipboard(item.item.name);
            writeMessage(`Copied ${item.item.name} to clipboard!`);
          }}
          on:keydown={(e) => {
            if (e.key != 'Enter') return;
            writeToClipboard(item.item.name);
            writeMessage(`Copied ${item.item.name} to clipboard!`);
          }}
        >
          <Icon path={item.item.path} size={2.5} />
          <p class="w-full py-2 text-center">{index}: {item.item.name}</p>
        </div>
      </LazyLoad>
    </div>
  </div>
</Notification>

<style lang="postcss">
  .icons {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
</style>
