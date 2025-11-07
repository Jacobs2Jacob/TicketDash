import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        define: {
            'process.env': {}
        },
        server: {
            port: 54306,
            proxy: {
                '/api/cocktails': {
                    target: env.VITE_COCKTAIL_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/cocktails/, ''),
                },
            },
        },
    }
});