<script lang="ts">
	import { fade } from 'svelte/transition';

	let message: string;

	/**
	 * Wait x seconds before hiding the notification
	 * @param seconds
	 */
	function wait(seconds: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, seconds * 1000);
		});
	}

	/**
	 * Write a message to the notification
	 */
	function hideMessage() {
		message = '';
	}

	/**
	 * Write a message to the notification
	 * @param msg
	 */
	async function writeMessage(msg: string) {
		message = msg;
		await wait(3);
		hideMessage();
	}
</script>

{#if message}
	<div class="notification" on:click={hideMessage} on:keydown={hideMessage} transition:fade>
		{message}
	</div>
{/if}

<slot {writeMessage} />

<style>
	.notification {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		padding: 0.5rem 0.75rem;
		background-color: rgb(15, 23, 42);
		z-index: 1111;
		color: rgb(241, 245, 249);
		border-radius: 0.25rem;
	}
</style>
