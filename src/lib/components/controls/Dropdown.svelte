<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';
  import type { Dropdown } from '$lib/controls/Dropdown.svelte';

  type DropdownProps = {
    controller: Dropdown;
  };

  const { controller: dropdown }: DropdownProps = $props();
</script>

<Select.Root type="single" name="favoriteFruit" bind:value={dropdown.value}>
  <Select.Trigger class="w-[180px]">
    {dropdown.value || 'Select item'}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#if dropdown.label}
        <Select.GroupHeading>{dropdown.label}</Select.GroupHeading>
      {/if}
      {#each dropdown.values as item}
        <Select.Item value={item} label={item}>
          {item}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
