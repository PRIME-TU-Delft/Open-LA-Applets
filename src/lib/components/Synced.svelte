<script lang="ts">
	import { page } from '$app/stores';
    import type { Vector } from 'three';

	const targetOrigins = ["https://dbalague.pages.ewi.tudelft.nl", "http://localhost:8000"];
	const localUrl = $page?.url?.href?.split('/').slice(-2).join('-');

	let variable: string;
	export { variable as id };
	export let position: Vector;  // Anything that implements a three.js Vector interface, usually a Vector2 or Vector3


	$: {
		let message = new SyncMessage(localUrl, variable, position);
		message.send();
	}


	/**
	 * Message to synchronize the state of the applet with the parent window.
	 * The state is a list of KV pairs, where the key is the name of the variable and the value is its value.
	 *
	 * ```ts
	 * let appletName = $page?.url?.href?.split('/').slice(-2).join('-');
	 * let state = [['x', 0], ['y', 0], ['z', 0]];
	 * let message = new SyncMessage(appletName, state);
	 * message.send();
	 * ```
	 */
	class SyncMessage {
		applet: string;
		variable: string;
		position: Vector;

		constructor(applet: string, variable: string, position: Vector) {
			this.applet = applet;
			this.variable = variable;
			this.position = position;
		}

		send() {
			// for (const origin of targetOrigins) {
			// 	window.top?.postMessage(this, origin);
			// }
			// ^ doesn't work, so for now just send to any origin
			// Failed to execute ‘postMessage’ on ‘DOMWindow’: The target origin provided (‘https://dbalague.pages.ewi.tudelft.nl’) does not match the recipient window’s origin (‘http://localhost:5173’).
			window.top?.postMessage(this, "*");
		}
	}
</script>
