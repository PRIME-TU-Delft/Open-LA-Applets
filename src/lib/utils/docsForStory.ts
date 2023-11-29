import type { Meta } from '@storybook/svelte';

/**
 * Simple helper to add a description to a story
 * @param text - The text to add as a description
 * @returns complex object for storybook
 */
export default function (text: string, subtitle?: string) {
  return {
    componentSubtitle: subtitle,
    docs: { description: { story: text, component: text } }
  } as Meta['parameters'];
}
