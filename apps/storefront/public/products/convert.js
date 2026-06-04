const sharp = require('sharp');
const fs = require('fs');

fs.readdir('.', (err, files) => {
  if (err) return console.error(err);

  files.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const output = file.replace(/\.(png|jpg|jpeg)$/, '.webp');
      sharp(file)
        .webp({ quality: 85 })
        .toFile(output)
        .then(() => console.log(`✅ Convertido: ${file} → ${output}`))
        .catch(err => console.error(`❌ Error con ${file}:`, err));
    }
  });
});
