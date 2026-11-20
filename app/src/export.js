// export.js
import { drawCover } from './cover.js';

export async function exportCover(canvasData) {
    const offscreen = document.createElement('canvas');
    // Determine size based on request (1080x1080, 1080x1350, 1920x1080)
    // For now, let's assume 1080x1080
    offscreen.width = 1080;
    offscreen.height = 1080;

    await drawCover(offscreen, canvasData);

    const url = offscreen.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sundown-cover.png';
    a.click();
}
