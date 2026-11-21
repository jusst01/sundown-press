import { drawCover } from './cover.js';
import { loadPhoto, SAMPLE_FOCALS } from './photo-manager.js';
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
    panelTags: {},
    title: 'SUNSET HEIST',
    caption: 'A JALLU STORY',
    effects: { grain: true, vignette: true, borders: true, halftone: false }
};

async function update() {
    const params = new URLSearchParams(window.location.search);

    // Parse shot-scene state
    state.fillMode = params.get('fill') || state.fillMode;
    state.caption = params.get('caption') || state.caption;
    state.panelTags = {};
    if (params.has('tags')) {
        const tagPairs = params.get('tags').split(',');
        for (const pair of tagPairs) {
            const [panel, text] = pair.split(':');
            state.panelTags[panel] = decodeURIComponent(text);
        }
    }

    if (params.has('assign')) {
        state.photoAssignments = {};
        const assignments = params.get('assign').split(',');
        const focals = {};
        if (params.has('focals')) {
            const focalPairs = params.get('focals').split(',');
            for (const pair of focalPairs) {
                const [panel, coords] = pair.split(':');
                const [fx, fy] = coords.split('x');
                focals[panel] = { x: parseFloat(fx), y: parseFloat(fy) };
            }
        }

        for (const pair of assignments) {
            const [panel, sample] = pair.split(':');
            // Fetch/load
            const response = await fetch(`samples/${sample}.jpg`);
            const blob = await response.blob();
            const photo = await loadPhoto(new File([blob], `${sample}.jpg`), { focal: focals[panel] || SAMPLE_FOCALS[sample] });
            state.photoAssignments[panel] = photo;
        }
    } else {
        const photoParam = params.get('photo') || 'pier';
        const response = await fetch(`samples/${photoParam}.jpg`);
        const blob = await response.blob();
        const photo = await loadPhoto(new File([blob], `${photoParam}.jpg`), { focal: SAMPLE_FOCALS[photoParam] });
        state.photoAssignments['hero'] = photo;
    }

    if (params.get('shot') === 'sizes') {
        renderSizesView(params);
        return;
    }

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

async function renderSizesView(params) {
    if (window.__sizesBuilt) return;
    window.__sizesBuilt = true;

    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.background = '#1a1a1a';
    document.body.style.overflow = 'hidden';

    // Hide other stuff.
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
    const aside = document.querySelector('aside');
    if (aside) aside.style.display = 'none';
    const main = document.querySelector('main');
    if (main) main.style.display = 'none';
    const preview = document.querySelector('.preview');
    if (preview) preview.style.display = 'none';
    canvas.style.display = 'none'; // The preview canvas

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '24px';
    document.body.appendChild(container);

    const sizes = [{w: 1080, h: 1080, label: '1080 × 1080'}, {w: 1080, h: 1350, label: '1080 × 1350'}];
    const displayTitle = state.title.trim() !== '' ? state.title : state.caption;

    for (const size of sizes) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        container.appendChild(wrapper);

        const c = document.createElement('canvas');
        c.width = size.w;
        c.height = size.h;
        c.style.height = '620px';
        c.style.width = 'auto';
        wrapper.appendChild(c);

        const label = document.createElement('div');
        label.innerText = size.label;
        label.style.color = '#f0e6d2';
        label.style.marginTop = '10px';
        wrapper.appendChild(label);

        await drawCover(c, { ...state, title: displayTitle });
    }
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
    runShot(params.get('shot'), params, async (q) => {
        // The load callback just triggers re-render,
        // as parsing logic is now inside update().
        await update();
    });
}
