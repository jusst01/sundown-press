import { drawCover } from './cover.js';
import { loadPhoto } from './photo-manager.js';
import { runShot } from './shots.js';
import { layouts } from './layout-templates.js';

const canvas = document.getElementById('cover');
const titleInput = document.getElementById('title');
const captionInput = document.getElementById('caption');
const fileInput = document.getElementById('file-input');
const exportBtn = document.getElementById('export');

let state = {
    layout: 'STRIP',
    fillMode: 'span',
    photoAssignments: {}, // panelID: photoObject
    panelGrades: {},
    title: 'SUNSET HEIST',
    caption: 'A JALLU STORY',
    effects: { grain: true, vignette: true, borders: true, halftone: false }
};

async function update() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shot') === 'cover') {
        const sizeParam = params.get('size');
        if (sizeParam) {
            const [wStr, hStr] = sizeParam.split('x');
            const w = parseInt(wStr, 10);
            const h = parseInt(hStr, 10);
            if (w && h) {
                canvas.width = w;
                canvas.height = h;
                // Size the element in px too: in headless the layout viewport can be
                // shorter than the capture, so 100vh would leave a black strip.
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
            }
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
        }
    } else {
        canvas.width = 1080;
        canvas.height = 1350; // default for now
    }

    const layoutParam = params.get('layout');
    if (layoutParam) {
        const upperLayout = layoutParam.toUpperCase();
        if (layouts[upperLayout]) {
            state.layout = upperLayout;
        }
    }

    const titleParam = params.get('title');
    if (titleParam) {
        state.title = titleParam;
    }

    // Title logic: title field if non-empty, otherwise caption
    const displayTitle = state.title.trim() !== '' ? state.title : state.caption;

    await drawCover(canvas, { ...state, title: displayTitle });
}

fileInput.addEventListener('change', async (e) => {
    for (const file of e.target.files) {
        const photo = await loadPhoto(file);
        state.photoAssignments['hero'] = photo;
        break;
    }
    update();
});

titleInput.addEventListener('input', (e) => {
    state.title = e.target.value;
    update();
});
captionInput.addEventListener('input', (e) => {
    state.caption = e.target.value;
    update();
});

exportBtn.addEventListener('click', () => {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sundown-cover.png';
    a.click();
});

// Initial render
update();

document.querySelectorAll('input[name="fill"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        state.fillMode = e.target.value === 'all' ? 'span' : 'per-panel';
        update();
    });
});

const params = new URLSearchParams(window.location.search);
if (params.has('shot')) {
    runShot(params.get('shot'), params, async (url, cap) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const photo = await loadPhoto(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
        state.photoAssignments['hero'] = photo;
        state.caption = cap;
        update();
    });
}
