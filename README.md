# Automated JSON Resume Pipeline

A highly modular, custom resume compilation pipeline built using Node.js and headless Puppeteer. This setup completely bypasses the legacy JSON Resume CLI bugs to generate a pixel-perfect, highly dense resume matching traditional professional templates.

## Architecture
- `resume.json`: The single-source-of-truth structural data layer.
- `src/style.css`: Isolated layout and typography aesthetics.
- `src/template.js`: Pure functional layout rendering engine.
- `src/render.js`: Automated I/O orchestration and PDF/HTML compiler.

## How to Compile
```bash
npm install
node src/render.js
```
