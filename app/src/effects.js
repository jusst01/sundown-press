// effects.js

export function applyEffects(ctx, canvas, { grain, vignette, borders, halftone }) {
    const { width: w, height: h } = canvas;

    if (vignette) {
        const grad = ctx.createRadialGradient(w/2, h/2, w*0.3, w/2, h/2, w*0.8);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.15)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    if (borders) {
        ctx.strokeStyle = '#FFFACD';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, w-10, h-10);
        ctx.strokeStyle = '#2b1838';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, w-20, h-20);
    }
}
