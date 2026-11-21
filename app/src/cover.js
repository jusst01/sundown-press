// cover.js
import { drawLettering } from './lettering.js';
import { applyEffects } from './effects.js';
import { layouts } from './layout-templates.js';
import { photos } from './photo-manager.js';
import { grades } from './grades.js';

function fitRect(imgW, imgH, tx, ty, tw, th, focal) {
    const scale = Math.max(tw / imgW, th / imgH);
    const pw = imgW * scale;
    const ph = imgH * scale;
    // position so the focal point lands at the target rect's centre
    let px = tx + tw / 2 - focal.x * pw;
    let py = ty + th / 2 - focal.y * ph;
    // each clamped so the image still covers the rect
    px = Math.max(Math.min(px, tx), tx + tw - pw);
    py = Math.max(Math.min(py, ty), ty + th - ph);
    return { px, py, pw, ph };
}

function getPanelPath(panel, w, h) {
    const path = new Path2D();
    const x = panel.x * w;
    const y = panel.y * h;
    const width = panel.w * w;
    const height = panel.h * h;

    const skew = (panel.skew || 0) * Math.PI / 180;
    const offset = height * Math.tan(skew);

    path.moveTo(x + offset, y);
    path.lineTo(x + width + offset, y);
    path.lineTo(x + width - offset, y + height);
    path.lineTo(x - offset, y + height);
    path.closePath();
    return path;
}

const roleMap = {
    'hero': 'THE GETAWAY',
    'stack1': 'THE DRIVER',
    'stack2': 'THE INSIDER',
    'stack3': 'THE LOOKOUT',
    'top': 'THE STAGE',
    'bot1': 'THE DRIVER',
    'bot2': 'THE INSIDER',
    'bot3': 'THE LOOKOUT',
    'v1': 'THE DRIVER',
    'v2': 'THE GETAWAY',
    'v3': 'THE LOOKOUT',
    'q1': 'SCENE ONE',
    'q2': 'SCENE TWO',
    'q3': 'SCENE THREE',
    'q4': 'SCENE FOUR',
    'n1': 'SCENE 1', 'n2': 'SCENE 2', 'n3': 'SCENE 3',
    'n4': 'SCENE 4', 'n5': 'SCENE 5', 'n6': 'SCENE 6',
    'n7': 'SCENE 7', 'n8': 'SCENE 8', 'n9': 'SCENE 9',
};

function drawTopStrip(ctx, w, h) {
    const stripH = h * 0.045;
    ctx.save();
    ctx.fillStyle = 'rgba(26, 26, 26, 0.9)';
    ctx.fillRect(0, 0, w, stripH);

    // Left: stars
    ctx.font = `${stripH * 0.5}px 'Archivo', sans-serif`;
    ctx.fillStyle = '#f5a623';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('★★★★★', w * 0.02, stripH / 2);

    // Center: quote
    ctx.font = `600 ${stripH * 0.38}px 'Archivo', sans-serif`;
    ctx.fillStyle = '#f0e6d2';
    ctx.textAlign = 'center';
    ctx.fillText('A POSTER THAT HITS LIKE A HEADLINE', w / 2, stripH / 2);

    // Right: VOL. 1 tag
    ctx.font = `700 ${stripH * 0.4}px 'Archivo', sans-serif`;
    ctx.fillStyle = '#f0e6d2';
    ctx.textAlign = 'right';
    ctx.fillText('VOL. 1', w - w * 0.02, stripH / 2);
    ctx.restore();
}

function drawSeal(ctx, canvas, currentLayout) {
    const { width: w, height: h } = canvas;
    const sealD = h * 0.09;
    const heroPanel = currentLayout.panels.find(p => p.id === 'hero') || currentLayout.panels[0];
    if (!heroPanel) return;

    const cx = w - sealD / 2 - w * 0.01;
    const cy = h * 0.045 + sealD / 2 + h * 0.01;

    ctx.save();
    ctx.translate(cx, cy);

    // Dark plum fill circle
    ctx.beginPath();
    ctx.arc(0, 0, sealD / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#2b1838';
    ctx.fill();

    // Cream rings
    ctx.lineWidth = sealD * 0.04;
    ctx.strokeStyle = '#f0e6d2';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, sealD / 2 - sealD * 0.08, 0, Math.PI * 2);
    ctx.lineWidth = sealD * 0.015;
    ctx.stroke();

    // Text: SP in Anton
    ctx.fillStyle = '#f0e6d2';
    ctx.font = `900 ${sealD * 0.42}px Anton, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SP', 0, -sealD * 0.05);

    // SUNDOWN PRESS in tiny caps beneath, shrunk to fit inside the circle
    let sealSmall = sealD * 0.12;
    ctx.font = `700 ${sealSmall}px 'Archivo', sans-serif`;
    const maxTextW = sealD * 0.8;
    const measured = ctx.measureText('SUNDOWN PRESS').width;
    if (measured > maxTextW) {
        sealSmall *= maxTextW / measured;
        ctx.font = `700 ${sealSmall}px 'Archivo', sans-serif`;
    }
    ctx.fillText('SUNDOWN PRESS', 0, sealD * 0.26);

    ctx.restore();
}

function drawBarcode(ctx, w, h) {
    const bw = w * 0.09;
    const bh = h * 0.055;
    const bx = w - bw - w * 0.02;
    const by = h - bh - h * 0.02;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(bx, by, bw, bh, 4);
    } else {
        ctx.rect(bx, by, bw, bh);
    }
    ctx.fill();

    ctx.fillStyle = '#000000';
    const barAreaX = bx + bw * 0.08;
    const barAreaY = by + bh * 0.12;
    const barAreaW = bw * 0.84;
    const barAreaH = bh * 0.65;

    const pattern = [2,1,1,3,1,2,1,1,2,3,1,2,1,1,3,2,1,2,1,1,2];
    let totalUnits = pattern.reduce((a, b) => a + b, 0);
    let unitW = barAreaW / totalUnits;
    let curX = barAreaX;

    for (let i = 0; i < pattern.length; i++) {
        const w_bar = pattern[i] * unitW;
        if (i % 2 === 0) {
            ctx.fillRect(curX, barAreaY, w_bar, barAreaH);
        }
        curX += w_bar;
    }

    ctx.fillStyle = '#000000';
    ctx.font = `700 ${bh * 0.18}px monospace, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SDP-001', bx + bw / 2, barAreaY + barAreaH + 2);
    ctx.restore();
}

function drawPanelTag(ctx, panel, index, w, h, data) {
    ctx.save();
    const path = getPanelPath(panel, w, h);
    ctx.clip(path);

    let role = 'SCENE';
    if (data.panelTags && data.panelTags[panel.id]) {
        role = data.panelTags[panel.id];
    } else if (data.fillMode === 'span') {
        role = `SCENE ${index + 1}`;
    } else {
        role = roleMap[panel.id] || `SCENE ${(panel.id || '').toUpperCase()}` || 'SCENE';
    }
    const skewAngle = (panel.skew || -4) * Math.PI / 180;
    const px = panel.x * w + w * 0.015;
    // Never let a tag sit underneath the top furniture strip.
    const py = Math.max(panel.y * h + h * 0.02, h * 0.055);

    ctx.translate(px, py);
    ctx.rotate(skewAngle);

    const tagH = h * 0.022;
    ctx.font = `700 ${tagH * 0.7}px 'Archivo', sans-serif`;
    const textW = ctx.measureText(role).width;
    const padX = tagH * 0.6;
    const tagW = textW + padX * 2;

    ctx.fillStyle = '#2b1838';
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(0, 0, tagW, tagH, tagH * 0.3);
    } else {
        ctx.rect(0, 0, tagW, tagH);
    }
    ctx.fill();

    ctx.fillStyle = '#f0e6d2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(role, tagW / 2, tagH / 2);

    ctx.restore();
}

export async function drawCover(canvas, data) {
    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = canvas;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Fill background with cream
    ctx.fillStyle = '#f0e6d2';
    ctx.fillRect(0, 0, w, h);

    // 1. Draw panels
    const currentLayout = layouts[data.layout || 'STRIP'];
    const allPhotos = [...photos.values()];
    const band = currentLayout.band;

    // True Span Fill: compute ONE cover-fit of the photo against the FULL canvas
    let spanImg = null;
    let spanPx = 0, spanPy = 0, spanPw = 0, spanPh = 0;
    if (data.fillMode === 'span' && allPhotos.length > 0) {
        const spanPhoto = data.photoAssignments['hero'] || allPhotos[0];
        if (spanPhoto) {
            spanImg = new Image();
            spanImg.src = spanPhoto.url;
            await new Promise(r => spanImg.onload = r);

            // Anchor span photo focal to the CENTRE OF THE LARGEST-AREA PANEL
            let largestPanel = currentLayout.panels[0];
            let maxArea = 0;
            for (const panel of currentLayout.panels) {
                const area = panel.w * panel.h;
                if (area > maxArea) {
                    maxArea = area;
                    largestPanel = panel;
                }
            }
            const anchorX = largestPanel.x + largestPanel.w / 2;
            const anchorY = largestPanel.y + largestPanel.h / 2;

            const focal = spanPhoto.focal || { x: 0.5, y: 0.5 };
            const scale = Math.max(w / spanImg.width, h / spanImg.height);
            spanPw = spanImg.width * scale;
            spanPh = spanImg.height * scale;

            spanPx = (anchorX * w) - (focal.x * spanPw);
            spanPy = (anchorY * h) - (focal.y * spanPh);
            // Clamp
            spanPx = Math.max(Math.min(spanPx, 0), w - spanPw);
            spanPy = Math.max(Math.min(spanPy, 0), h - spanPh);
        }
    }

    for (let i = 0; i < currentLayout.panels.length; i++) {
        const panel = currentLayout.panels[i];

        ctx.save();
        const path = getPanelPath(panel, w, h);
        ctx.clip(path);

        const grade = grades[data.panelGrades ? data.panelGrades[panel.id] : 'viceSunset'] || grades.viceSunset;
        ctx.filter = grade.filter;

        if (data.fillMode === 'span' && spanImg) {
            // Draw same full-canvas image at full-canvas position inside each panel clip
            ctx.drawImage(spanImg, spanPx, spanPy, spanPw, spanPh);
        } else {
            // Per-panel mode keeps per-panel cover-fit
            let photo = data.photoAssignments[panel.id] || allPhotos[i % allPhotos.length];
            if (photo) {
                const img = new Image();
                img.src = photo.url;
                await new Promise(r => img.onload = r);

                const targetW = panel.w * w;
                const targetH = panel.h * h;
                const targetX = panel.x * w;
                const targetY = panel.y * h;

                const { px, py, pw, ph } = fitRect(img.width, img.height, targetX, targetY, targetW, targetH, photo.focal || { x: 0.5, y: 0.5 });
                ctx.drawImage(img, px, py, pw, ph);
            } else {
                ctx.fillStyle = '#333';
                ctx.fillRect(panel.x * w, panel.y * h, panel.w * w, panel.h * h);
            }
        }

        // Overlay
        ctx.filter = 'none';
        ctx.globalCompositeOperation = grade.overlay.blend;
        const targetX = panel.x * w;
        const targetY = panel.y * h;
        const targetW = panel.w * w;
        const targetH = panel.h * h;
        ctx.fillStyle = grade.overlay.highlight;
        ctx.fillRect(targetX, targetY, targetW, targetH);
        ctx.fillStyle = grade.overlay.shadow;
        ctx.fillRect(targetX, targetY, targetW, targetH);

        ctx.restore();

        // Stroke keyline
        ctx.save();
        ctx.strokeStyle = '#2b1838';
        ctx.lineWidth = 2;
        ctx.stroke(getPanelPath(panel, w, h));
        ctx.restore();
    }

    // Draw Band
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(band.x * w, band.y * h, band.w * w, band.h * h);

    // 3a. Top Strip
    drawTopStrip(ctx, w, h);

    // 3e. Per-panel caption tags (after the top strip so they stay readable)
    for (let i = 0; i < currentLayout.panels.length; i++) {
        drawPanelTag(ctx, currentLayout.panels[i], i, w, h, data);
    }

    // 3d. Seal
    drawSeal(ctx, canvas, currentLayout);

    // 2. Draw effects
    applyEffects(ctx, canvas, data.effects);

    // 3. Draw lettering & credits
    drawLettering(ctx, canvas, data.title, data.caption, band);

    // 3c. Barcode
    drawBarcode(ctx, w, h);
}
