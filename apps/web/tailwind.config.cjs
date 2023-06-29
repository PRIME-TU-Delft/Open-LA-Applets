/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'../../packages/ui/components/**/*.{html,js,svelte,ts,svx}',
		'../../packages/p5-components/components/**/*.{html,js,svelte,ts,svx}',
		'./src/**/*.{html,js,svelte,ts,svx}'
	],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography')]
};
