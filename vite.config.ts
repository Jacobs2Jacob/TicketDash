import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => { 
    const env = loadEnv(mode, path.resolve(__dirname, '.'), '');
     
    console.log('[VITE] Using API target:', env.VITE_TICKET_API_URL);

    return {
        envDir: path.resolve(__dirname, '.'), 
        plugins: [react()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_TICKET_API_URL,
                    changeOrigin: true,
                    secure: false
                },
            },
        },
    };
});