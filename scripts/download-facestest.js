import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUTPUT_DIR = './public/img/test/persons';
const TOTAL = 50;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function descargar() {
  for (let i = 0; i < TOTAL; i++) {
    try {
      // Fetch image as buffer
      const response = await axios.get('https://thispersondoesnotexist.com/', { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      // Resize to 200x200 and save
      const file = path.join(OUTPUT_DIR, `persona_${i + 1}.jpg`);
      await sharp(buffer).resize(200, 200).toFile(file);

      console.log(`✅ Imagen ${i + 1} redimensionada y guardada`);
    } catch (err) {
      console.error(`❌ Error en imagen ${i + 1}: ${err.message}`);
    }
  }
}

descargar();
