import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';

const locals = {};

export default defineConfig({
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    plugins: [
        pugPlugin({ pretty: true }, locals)
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:5000',
        },
    },
});
