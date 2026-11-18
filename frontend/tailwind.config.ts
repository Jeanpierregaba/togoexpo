import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#166C54',
        pine: '#0F5A45',
        deeppine: '#0F4F3E',
        // Fond neutre des bannières et diaporamas : sous les photos, plus de vert.
        ink: '#111513',
        cream: '#F3F1EA',
        paper: '#FBFAF6',
        sun: '#FFCE00',
        blood: '#D20F34',
        mist: '#D6E4DD',
        sage: '#A8C4B7',
        moss: '#5E8573',
        pineink: '#124D3D',
        togo: {
          green: '#006A4E',
          yellow: '#FFCE00',
          red: '#D20F34',
          ink: '#166C54',
          sand: '#F3F1EA',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
