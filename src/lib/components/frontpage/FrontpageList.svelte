<script lang="ts">
  import { resolve } from '$app/paths';
  import ExternalLink from '@lucide/svelte/icons/external-link';
</script>

<blockquote class="border-green-400/50 bg-green-400/10 py-2 text-green-800">
  Find the category you want:
  <ul>
    <li>
      Looking for <span class="font-bold">Linear Algebra</span> applets? Go to the
      <a class="inline-flex items-center gap-1 hover:underline" href={resolve('/')}
        >main page <ExternalLink class="h-4 w-4" /></a
      >
    </li>

    <li>
      Looking for <span class="font-bold">Calculus</span> applets? Go to
      <a class="inline-flex items-center gap-1 hover:underline" href={resolve('/calculus')}
        >/calculus <ExternalLink class="h-4 w-4" /></a
      >
    </li>
    <li>
      Looking for <span class="font-bold">Probability Theory and Statistics</span> applets? Go to
      <a class="inline-flex items-center gap-1 hover:underline" href={resolve('/pts')}
        >/pts <ExternalLink class="h-4 w-4" /></a
      >
    </li>
    <li>
      Looking for other applets? Go to
      <a class="inline-flex items-center gap-1 hover:underline" href={resolve('/other')}
        >/other <ExternalLink class="h-4 w-4" /></a
      >
    </li>
  </ul>
</blockquote>
