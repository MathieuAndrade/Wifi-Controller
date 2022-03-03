const defaultTheme = require('tailwindcss/defaultTheme');
const daisyui = require('daisyui');

module.exports = {
  mode: 'jit',
  content: {
    files: ['./src/**/*.{html,js,svelte,ts}'],
    extract: {
      defaultExtractor: (content) => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/(?<=class:)[^=>/\s]*/g) || []),
      ],
    },
  },
  theme: {
    screens: {
      xs: '360px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Open Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
