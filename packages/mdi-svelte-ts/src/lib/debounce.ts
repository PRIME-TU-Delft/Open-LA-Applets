/**
 * Wait for a certain amount of time before executing a function more than once. This makes searching more efficient.
 * @param cb Callback function that is delayed by the specified time
 * @param delay delay time in milliseconds
 * @returns Generic S
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debounce<T extends any[], S>(cb: (...args: T[]) => S, delay = 250) {
	let timeout: NodeJS.Timeout;

	return (...args: T[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
}
