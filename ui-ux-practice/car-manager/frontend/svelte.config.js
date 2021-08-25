import preprocess from 'svelte-preprocess';
import WindiCSS from 'vite-plugin-windicss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		target: '#svelte',
		vite: () => ({
			plugins: [WindiCSS.default()]
		})
	}
};
export default config;
