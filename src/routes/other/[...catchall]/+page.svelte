<script lang="ts">
  import FolderList from '$lib/components/frontpage/FolderList.svelte';
  import NavBar from '$lib/components/frontpage/NavBar.svelte';
  import Credits from '$lib/components/frontpage/Credits.svelte';
  import FrontpageList from '$lib/components/frontpage/FrontpageList.svelte';

  const modules = import.meta.glob('/src/routes/applet/other/**/+page.svelte');

  const fileUrls = Object.keys(modules).map((rawUrl) =>
    // Remove head of path and extension
    rawUrl.replace('/src/routes/applet/other/', '').replace('/+page.svelte', '')
  );
</script>

<NavBar
  bookTitle="Open LA book"
  bookURL="https://interactivetextbooks.tudelft.nl/linear-algebra/"
  {fileUrls}
  directory="other/"
/>

<div class="mx-auto my-32 max-w-4xl rounded-xl bg-blue-50 p-10">
  <div class="prose w-full max-w-full">
    <h1>Other interactive applets</h1>

    These are development applets.

    <FrontpageList />

    <blockquote class="border-green-400/50 bg-green-400/10 py-2 text-green-800">
      <span class="font-bold">Hint:</span>
      Press
      <kbd
        class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
      >
        <span class="text-xs">⌘/Ctrl</span>K
      </kbd> to search through all applets.
    </blockquote>
  </div>

  <FolderList {fileUrls} directory="other/" />

  <Credits />

  <div class="rounded bg-slate-300 p-10">
    <img class="h-20 w-full object-contain" alt="prime-tudelft" src="/logo-black.png" />
  </div>
</div>
