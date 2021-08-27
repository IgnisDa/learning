import { defineConfig } from 'windicss/helpers';
import defaultTheme from 'windicss/defaultTheme';

const PRODUCTION = process.env.NODE_ENV !== 'production';

export default defineConfig({
	extract: {
		include: ['**/*.{svelte,}'],
		exclude: ['node_modules', '.git', 'dist', 'personal']
	},
	darkMode: 'class',
	presets: [require('frontend-commons/tailwind/preset')],
	theme: {
		fontFamily: {
			...defaultTheme.fontFamily,
			sans: ['Biotif', ...defaultTheme.fontFamily.sans],
			heading: ['Bogart', 'sans-serif']
		}
	},
	shortcuts: {
		'debug-screens': PRODUCTION
			? 'before:bottom-0 before:left-0 before:fixed before:z-[2147483647] before:px-1 before:text-12px before:bg-black before:text-white before:shadow-xl @sm:before:content-["screen:sm"] @md:before:content-["screen:md"] @lg:before:content-["screen:lg"] @xl:before:content-["screen:xl"] @2xl:before:content-["screen:2xl"] <sm:before:content-["screen:none"]'
			: ''
	}
});
