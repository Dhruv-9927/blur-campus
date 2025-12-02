import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: {
                    DEFAULT: "var(--card-bg)",
                    border: "var(--card-border)",
                },
                accent: {
                    pink: "var(--accent-pink)",
                },
                muted: "var(--muted)",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)"],
                mono: ["var(--font-geist-mono)"],
                serif: ["var(--font-playfair)"],
                script: ["var(--font-dancing)"],
            },
        },
    },
    plugins: [],
};
export default config;
