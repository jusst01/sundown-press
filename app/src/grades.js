// grades.js

export const grades = {
  viceSunset: {
    name: 'Vice Sunset',
    filter: 'saturate(1.25) contrast(1.1)',
    overlay: { highlight: 'rgba(255, 100, 0, 0.2)', shadow: 'rgba(0, 100, 100, 0.3)', blend: 'screen' }
  },
  neonStrip: {
    name: 'Neon Strip',
    filter: 'saturate(1.4) contrast(1.15)',
    overlay: { highlight: 'rgba(255, 0, 255, 0.2)', shadow: 'rgba(0, 255, 255, 0.3)', blend: 'screen' }
  },
  goldenHour: {
    name: 'Golden Hour',
    filter: 'sepia(0.2) saturate(1.3) brightness(1.05)',
    overlay: { highlight: 'rgba(255, 150, 0, 0.3)', shadow: 'rgba(50, 20, 0, 0.2)', blend: 'overlay' }
  },
  midnightHeat: {
    name: 'Midnight Heat',
    filter: 'brightness(0.92) contrast(1.2)',
    overlay: { highlight: 'rgba(255, 0, 100, 0.2)', shadow: 'rgba(100, 0, 255, 0.3)', blend: 'screen' }
  },
  palmNoir: {
    name: 'Palm Noir',
    filter: 'grayscale(1) contrast(1.2)',
    overlay: { highlight: 'rgba(255, 0, 100, 0.4)', shadow: 'rgba(0, 0, 0, 0.5)', blend: 'screen' }
  },
  chromeCoast: {
    name: 'Chrome Coast',
    filter: 'saturate(0.9) hue-rotate(10deg)',
    overlay: { highlight: 'rgba(200, 220, 255, 0.2)', shadow: 'rgba(0, 50, 100, 0.3)', blend: 'multiply' }
  }
};
