<script lang="ts">
  import './button.css';

  /**
   * @typedef {Object} ButtonProps
   */
  type ButtonProps = {
    primary?: boolean; // Hello
    backgroundColor?: string;
    size?: 'small' | 'medium' | 'large';
    label?: string;
  };

  let {
    primary = false,
    backgroundColor = undefined,
    size = 'medium',
    label = 'Button'
  }: ButtonProps = $props();

  const mode = $derived(primary ? 'storybook-button--primary' : 'storybook-button--secondary');

  const style = $derived(backgroundColor ? `background-color: ${backgroundColor}` : '');
</script>

<!-- @component
@props
  @prop {boolean} [primary=false] - Whether the button is primary or secondary
  @prop {string} [backgroundColor] - The background color of the button
  @prop {'small' | 'medium' | 'large'} [size='medium'] - The size of the button
  @prop {string} [label='Button'] - The label of the button
 -->

<button
  type="button"
  class={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
  {style}
  onclick={() => alert('clicking the button')}
>
  {label}
</button>
