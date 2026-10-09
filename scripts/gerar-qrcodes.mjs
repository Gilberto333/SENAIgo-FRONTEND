// Gera um PNG de QR Code para cada sala em ./qrcodes (npm run qrcodes).
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';
import { SALAS } from '../src/constants/salas.js';
import { buildQrPayload } from '../src/utils/qrCode.js';

const outDir = path.resolve('qrcodes');
const slug = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

await mkdir(outDir, { recursive: true });

for (const { salaId, sala } of SALAS) {
  const file = path.join(outDir, `sala-${salaId}-${slug(sala)}.png`);
  await QRCode.toFile(file, buildQrPayload(salaId), { width: 600, margin: 2, errorCorrectionLevel: 'M' });
  console.log(`✔ ${sala} -> ${path.relative(process.cwd(), file)}`);
}
