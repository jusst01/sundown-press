import { layouts } from './layout-templates.js';

export function drawLettering(ctx, canvas, title, caption, band) {
    const { width: w, height: h } = canvas;
    const bandH = band.h * h;
    const bandY = band.y * h;
    const bandX = band.x * w;
    const bandW = band.w * w;

    // 1. Title: Anton at >= 12% of canvas height, chrome gradient, outline, shadow
    let fontSize = Math.max(h * 0.12, bandH * 0.55);

    ctx.save();
    ctx.font = `900 ${fontSize}px Anton, sans-serif`;
    let textWidth = ctx.measureText(title.toUpperCase()).width;

    while (textWidth > bandW * 0.9 && fontSize > h * 0.05) {
        fontSize *= 0.9;
        ctx.font = `900 ${fontSize}px Anton, sans-serif`;
        textWidth = ctx.measureText(title.toUpperCase()).width;
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const text = title.toUpperCase();
    const x = bandX + bandW * 0.05;
    const titleY = bandY + bandH * 0.35;

    // Hard offset shadow
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = fontSize * 0.04;
    ctx.shadowOffsetY = fontSize * 0.04;
    ctx.shadowBlur = 0;

    // Thick dark outline
    ctx.strokeStyle = '#2b1838';
    ctx.lineWidth = fontSize * 0.07;
    ctx.strokeText(text, x, titleY);

    // Chrome gradient fill (#fdfdfd, #ffe9a8, #f5a623, #fff6d8)
    const gradient = ctx.createLinearGradient(0, titleY - fontSize / 2, 0, titleY + fontSize / 2);
    gradient.addColorStop(0, '#fdfdfd');
    gradient.addColorStop(0.33, '#ffe9a8');
    gradient.addColorStop(0.66, '#f5a623');
    gradient.addColorStop(1, '#fff6d8');
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, titleY);
    ctx.restore();

    // 2. Subtitle: script subtitle (italic serif, cream fill, soft magenta glow)
    if (caption) {
        ctx.save();
        const subFontSize = Math.max(h * 0.035, bandH * 0.18);
        ctx.font = `italic 600 ${subFontSize}px Georgia, 'Times New Roman', serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const subY = bandY + bandH * 0.78;

        ctx.shadowColor = 'magenta';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = '#fdfdfd';
        ctx.fillText(caption, x, subY);
        ctx.restore();
    }

    // 3. Bottom Credits Line (3b): one line of tiny letterspaced caps at the band's very bottom edge
    ctx.save();
    let credFontSize = Math.max(h * 0.014, bandH * 0.1);
    ctx.font = `700 ${credFontSize}px 'Archivo', sans-serif`;
    const credText = 'A SUNDOWN PICTURES PRODUCTION · STARRING YOU · SHOT ON YOUR OWN CAMERA';
    let credWidth = ctx.measureText(credText).width;

    if (credWidth > bandW * 0.72) {
        credFontSize *= Math.max(0.6, (bandW * 0.72) / credWidth);
        ctx.font = `700 ${credFontSize}px 'Archivo', sans-serif`;
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#f0e6d2';
    ctx.fillText(credText, x, bandY + bandH - bandH * 0.04);
    ctx.restore();
}
