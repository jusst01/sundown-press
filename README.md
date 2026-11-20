# Sundown Press

[![make.fun](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/c/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/jusst01/sundown-press/rank.svg)](https://make.fun/c/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/jusst01/sundown-press/reward.svg)](https://make.fun/c/gta6-cover-art-01)

Sundown Press is an offline GTA-style cover-art studio. Users can drop in photos, select from a variety of layouts and grades, and export custom poster-quality PNGs.

## Features

### Layouts
Choose from five distinct layouts:
- STRIP
- MARQUEE
- SLASH
- QUADS
- NINE

### Grades
Apply one of six split-tone grades to your creation, with support for per-panel grade overrides:
- Vice Sunset
- Neon Strip
- Golden Hour
- Midnight Heat
- Palm Noir
- Chrome Coast

### Photo Handling
- Multi-upload support.
- Drag-and-drop interface.
- Modes for one-photo spanning the entire poster or per-panel customization.
- Includes pan and zoom functionality for precise positioning.

### Exports
Export your creations in the following dimensions:
- 1080×1080
- 1080×1350
- 1920×1080

Exports can be triggered via four different actions.

## How to Run
1. Install dependencies (if not already installed).
2. Start the server:
   ```bash
   node serve.ts
   ```
3. Open `http://localhost:8080` in your browser.

## Credits
The two sample photos provided in `app/samples/` were generated for `make.fun` using an image model. The fonts used in the project are licensed under the OFL license (Anton and Archivo fonts; please see `app/fonts/OFL.txt` for details).
