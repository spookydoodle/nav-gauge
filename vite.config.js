import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    return {
        base: "/",
        plugins: [
            react({
                jsxImportSource: "@emotion/react",
                babel: {
                    plugins: ["@emotion/babel-plugin"],
                },
            }),
            svgr({ svgrOptions: { } }),
            //   viteTsconfigPaths(),
        ],
        build: {
            outDir: "dist",
            assetsDir: "assets",
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            "process.env": {
                NODE_ENV: "dev",
                PUBLIC_URL: "/",
                REACT_APP_API_PREFIX: "/api",
            },
        },
        server: {
            open: true,
            port: 3000,
            proxy: {
                "/api": {
                    target: "http://localhost:5000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
        preview: {
            open: true,
            port: 3000,
        },
    };
});
