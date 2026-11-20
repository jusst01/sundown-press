// layout-templates.js

export const layouts = {
  STRIP: {
    name: 'STRIP',
    description: 'Hero right, three stacked angled panels left',
    panels: [
      { id: 'hero', x: 0.45, y: 0, w: 0.55, h: 0.8 },
      { id: 'stack1', x: 0, y: 0, w: 0.45, h: 0.25, skew: 6 },
      { id: 'stack2', x: 0, y: 0.27, w: 0.45, h: 0.25, skew: 6 },
      { id: 'stack3', x: 0, y: 0.54, w: 0.45, h: 0.26, skew: 6 },
    ],
    band: { x: 0, y: 0.8, w: 1, h: 0.2 },
  },
  MARQUEE: {
    name: 'MARQUEE',
    description: 'Wide top, three angled panels below',
    panels: [
      { id: 'top', x: 0, y: 0, w: 1, h: 0.65 },
      { id: 'bot1', x: 0, y: 0.67, w: 0.33, h: 0.13, skew: 8 },
      { id: 'bot2', x: 0.34, y: 0.67, w: 0.33, h: 0.13, skew: 8 },
      { id: 'bot3', x: 0.68, y: 0.67, w: 0.32, h: 0.13, skew: 8 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  SLASH: {
    name: 'SLASH',
    description: 'Three vertical panels, alternating slant',
    panels: [
      { id: 'v1', x: 0, y: 0, w: 0.33, h: 0.8, skew: -7 },
      { id: 'v2', x: 0.34, y: 0, w: 0.33, h: 0.8, skew: 7 },
      { id: 'v3', x: 0.68, y: 0, w: 0.32, h: 0.8, skew: -7 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  QUADS: {
    name: 'QUADS',
    description: '2x2 with diagonal cross seam',
    panels: [
      { id: 'q1', x: 0, y: 0, w: 0.5, h: 0.4 },
      { id: 'q2', x: 0.51, y: 0, w: 0.49, h: 0.4 },
      { id: 'q3', x: 0, y: 0.41, w: 0.49, h: 0.41 },
      { id: 'q4', x: 0.51, y: 0.41, w: 0.49, h: 0.41 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  NINE: {
    name: 'NINE',
    description: '3x3 grid',
    panels: [
        { id: 'n1', x: 0, y: 0, w: 0.33, h: 0.26 },
        { id: 'n2', x: 0.34, y: 0, w: 0.33, h: 0.26 },
        { id: 'n3', x: 0.68, y: 0, w: 0.32, h: 0.26 },
        { id: 'n4', x: 0, y: 0.27, w: 0.33, h: 0.26 },
        { id: 'n5', x: 0.34, y: 0.27, w: 0.33, h: 0.26 },
        { id: 'n6', x: 0.68, y: 0.27, w: 0.32, h: 0.26 },
        { id: 'n7', x: 0, y: 0.54, w: 0.33, h: 0.26 },
        { id: 'n8', x: 0.34, y: 0.54, w: 0.33, h: 0.26 },
        { id: 'n9', x: 0.68, y: 0.54, w: 0.32, h: 0.26 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
};
