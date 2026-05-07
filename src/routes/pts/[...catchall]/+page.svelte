<script lang="ts">
  import ExternalLink from '@lucide/svelte/icons/external-link';
  import FolderList from '$lib/components/frontpage/FolderList.svelte';
  import NavBar from '$lib/components/frontpage/NavBar.svelte';
  import { resolve } from '$app/paths';
  import Credits from '$lib/components/frontpage/Credits.svelte';

  const modules = import.meta.glob('/src/routes/applet/pts/**/+page.svelte');

  const fileUrls = Object.keys(modules).map((rawUrl) =>
    // Remove head of path and extension
    rawUrl.replace('/src/routes/applet/pts/', '').replace('/+page.svelte', '')
  );
</script>

<NavBar bookTitle="Probability Theory and Statistics" {fileUrls} directory="pts/" />

<div class="mx-auto my-32 max-w-4xl rounded-xl bg-blue-50 p-10">
  <div class="prose w-full max-w-full">
    <h1>Interactive Probability Theory and Statistics applets</h1>
    These applets were created for the TU Delft Probability Theory and Statistics course. Abstract concepts
    are visualized in an interactive way to help students understand the material better. Using 2D and
    3D graphics, the applets provide a hands-on experience to explore the concepts.

    <p>
      The applets are sorted by the paragraph that they are associated with in the book. Feel free
      to explore each applet by clicking on the links below.
    </p>

    <blockquote class="border-green-400/50 bg-green-400/10 py-2 text-green-800">
      <span class="font-bold">Hint:</span>
      Looking for Linear Algebra applets? Go to the
      <a class="inline-flex items-center gap-1 hover:underline" href={resolve('/')}
        >main page <ExternalLink class="h-4 w-4" /></a
      >
    </blockquote>

    <blockquote class="border-yellow-400/50 bg-yellow-400/10 py-2 text-yellow-800">
      <span class="font-bold">Hint:</span>
      Looking for other applets? Go to
      <a class="inline-flex items-center gap-1 hover:underline" href={resolve('/other')}
        >/other <ExternalLink class="h-4 w-4" /></a
      >
    </blockquote>

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

  <FolderList {fileUrls} directory="pts/" />

  <Credits />

  <div class="rounded bg-slate-300 p-10">
    <img class="h-20 w-full object-contain" alt="prime-tudelft" src="/logo-black.png" />
  </div>
</div>
