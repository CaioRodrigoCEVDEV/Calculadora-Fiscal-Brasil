import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 45px -20px rgb(15 23 42 / 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
