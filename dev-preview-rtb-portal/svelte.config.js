import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';
import {resolve} from "path";
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: preprocess({
        postcss: {
            plugins: [
                tailwind,
                autoprefixer
            ]
        }
    }),

    kit: {
        adapter: adapter(),
        vite: {
            resolve: {
                alias: {
                    $components: resolve('./src/components'),
                    $stores: resolve('./src/stores'),
                    $actions: resolve('./src/actions'),
                    $assets: resolve('./src/assets'),
                    $utils: resolve('./src/utils')
                }
            }

        }
    }
};

export default config;
