<script>
  import { mdiShare } from '@mdi/js';
  import RoundButton from './RoundButton.svelte';

  export let showShareWindow = true;
  export let right = false;

  $: style = right ? 'transform: scaleX(-1)' : '';
</script>

<div {style}>
  <RoundButton
    twClass="!pl-10 !bg-base-100/70 !rounded-l-none "
    on:click={() => (showShareWindow = true)}
    icon={mdiShare}
  />
</div>
