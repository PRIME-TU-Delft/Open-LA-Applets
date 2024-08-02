/**
 * Format string to be more human readable
 * @param string String to format
 */
export function formatString(string: string) {
	const spaces = string.replaceAll('_', ' ');
	return spaces.charAt(0).toUpperCase() + spaces.slice(1);
}
