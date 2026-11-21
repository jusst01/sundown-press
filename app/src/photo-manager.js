// photo-manager.js

const MAX_DIM = 2048;

export const photos = new Map();

export const SAMPLE_FOCALS = { pier: { x: 0.35, y: 0.24 }, boulevard: { x: 0.55, y: 0.18 } };

export async function loadPhoto(file, opts = {}) {
    const url = URL.createObjectURL(file);
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    let w = img.width;
    let h = img.height;
    if (w > MAX_DIM || h > MAX_DIM) {
        const scale = MAX_DIM / Math.max(w, h);
        w *= scale;
        h *= scale;
    }
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);

    // Convert back to blob and then URL to save memory if necessary,
    // but for now, just keep the canvas/image. Actually, the requirement says "in-memory photo list with object URLs".
    // So let's store the object URL of the downscaled version.

    const finalUrl = await new Promise(resolve => canvas.toBlob(blob => resolve(URL.createObjectURL(blob)), 'image/jpeg', 0.8));
    URL.revokeObjectURL(url);

    const id = crypto.randomUUID();
    const photo = { id, url: finalUrl, width: w, height: h, zoom: 1, pan: { x: 0, y: 0 }, focal: opts.focal || { x: 0.5, y: 0.5 } };
    photos.set(id, photo);
    return photo;
}

export async function registerBuiltIn(id, path) {
    const response = await fetch(path);
    const blob = await response.blob();
    const file = new File([blob], id, { type: 'image/jpeg' });
    return loadPhoto(file, { focal: SAMPLE_FOCALS[id] || { x: 0.5, y: 0.5 } });
}

// Actually, I should just map name to photo object.
export const registry = new Map();
export async function initRegistry() {
    // Load pier and boulevard
    const pier = await fetch('samples/pier.jpg').then(r => r.blob());
    const boulevard = await fetch('samples/boulevard.jpg').then(r => r.blob());

    // For simplicity, I will implement a simpler loader here
    registry.set('pier', await loadPhoto(new File([pier], 'pier.jpg'), { focal: SAMPLE_FOCALS.pier }));
    registry.set('boulevard', await loadPhoto(new File([boulevard], 'boulevard.jpg'), { focal: SAMPLE_FOCALS.boulevard }));
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
