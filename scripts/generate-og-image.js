import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../public/images/og-image.png');
const LOGO = resolve(__dirname, '../public/images/logo.png');

const W = 1200;
const H = 630;

async function generate() {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');

    // Black background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    // Load and draw logo
    const logo = await loadImage(LOGO);
    const logoSize = 120;
    const logoX = (W - logoSize) / 2;
    const logoY = 160;
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

    // Brand name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BULGARIA', W / 2, logoY + logoSize + 70);

    // Subtitle
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '18px sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('BAR  &  COCINA', W / 2, logoY + logoSize + 105);

    // Tagline
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '22px sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('Menú Digital — Pedí por WhatsApp', W / 2, logoY + logoSize + 160);

    // Save
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(OUTPUT, buffer);
    console.log(`OG image saved to ${OUTPUT}`);
}

generate().catch(console.error);
