// Fixed scenes for screenshots: ?shot=editor shows the page with a sample photo; ?shot=cover shows the cover alone.
// `photo` picks the sample (samples/<photo>.jpg) and `caption` the words. window.__shotReady is set once painted.
export async function runShot(shot, query, load) {
  if (shot === 'cover' || shot === 'sizes') {
    document.body.classList.add('shot-cover');
    // Prefer explicit px from the size param: the headless layout viewport can be
    // shorter than the capture, so 100vh clips the canvas and leaves a black strip.
    const m = (query.get('size') || '').match(/^(\d+)x(\d+)$/);
    const cssH = m ? `${m[2]}px` : '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = cssH;
    document.body.style.minHeight = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.display = 'block';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = cssH;
    document.documentElement.style.minHeight = '0';
    document.documentElement.style.overflow = 'hidden';
    const canvas = document.getElementById('cover');
    if (canvas) {
        canvas.style.display = 'block';
        canvas.style.width = m ? `${m[1]}px` : '100vw';
        canvas.style.height = cssH;
        canvas.style.margin = '0';
        canvas.style.padding = '0';
        canvas.style.border = 'none';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
    }
    const main = document.querySelector('main');
    if (main) {
        main.style.display = 'block';
        main.style.padding = '0';
        main.style.margin = '0';
        main.style.height = cssH;
        main.style.minHeight = '0';
        main.style.width = m ? `${m[1]}px` : '100vw';
        main.style.overflow = 'visible';
    }
    const preview = document.querySelector('.preview');
    if (preview) {
        preview.style.display = 'block';
        preview.style.padding = '0';
        preview.style.margin = '0';
        preview.style.height = cssH;
        preview.style.minHeight = '0';
        preview.style.width = m ? `${m[1]}px` : '100vw';
        preview.style.overflow = 'visible';
        preview.style.background = 'none';
    }
  }
  await load(query);
  await document.fonts.load('900 100px Anton');
  await document.fonts.ready;
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
