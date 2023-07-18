<script lang="ts">
  import { mdiMagnify } from '@mdi/js';
  import Fuse from 'fuse.js';
  import { onMount } from 'svelte';
  import { debounce } from 'utils/timeDelay';
  import Icon from './Icon.svelte';
  import Input from './Input.svelte';
  import LazyLoad from './LazyLoad.svelte';
  import Notification from './Notification.svelte';

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
  <div class="container">
    <Input bind:value={searchQuery} on:keyup={handleKeyup}>
      <span class="searchBar">
        <span>{searchedIcons.length} icons</span>
        <Icon path={mdiMagnify} size={1.5} />
      </span>
    </Input>

    <div class="help">Click on an icon to copy to clipboard</div>

    <div class="icons">
      <LazyLoad items={searchedIcons} bind:page let:item let:index>
        <button
          class="icon"
          on:click={() => {
            writeToClipboard(item.item.name);
            writeMessage(`Copied ${item.item.name} to clipboard!`);
          }}
          on:keyup={(e) => {
            if (e.key === 'Enter') {
              writeToClipboard(item.item.name);
              writeMessage(`Copied ${item.item.name} to clipboard!`);
            }
          }}
        >
          <Icon path={item.item.path} size={2.5} />
          <p>{index}: {item.item.name}</p>
        </button>
      </LazyLoad>
    </div>
  </div>
</Notification>

<style lang="postcss">
  .container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 30rem;
  }

  .searchBar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .help {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: rgb(125, 125, 125);
  }

  .icons {
    display: grid;
    gap: 1rem;
    max-height: 20rem;
    margin-block: 1rem;
    overflow-x: hidden;
    overflow-y: auto;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }

  .icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    background-color: rgb(241, 245, 249);
    padding: 1rem 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;
    cursor: pointer;
  }

  .icon:hover {
    background-color: rgb(248, 250, 252);
  }
</style>
