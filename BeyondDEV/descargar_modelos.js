/**
 * Script para descargar los modelos de face-api.js necesarios para AuthBiometric.
 * 
 * Ejecutar con Node.js:
 *   node descargar_modelos.js
 * 
 * Descarga 3 modelos desde el CDN oficial a la carpeta ./models/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, 'models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Solo los 3 modelos necesarios
const FILES = [
    // TinyFaceDetector — detección rápida de rostros
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    // FaceLandmark68 — puntos de referencia faciales
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    // FaceRecognition — extracción de descriptores 128D
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
];

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        
        function doRequest(requestUrl) {
            https.get(requestUrl, (response) => {
                // Handle redirects
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    doRequest(response.headers.location);
                    return;
                }
                
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode} al descargar ${requestUrl}`));
                    return;
                }

                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(dest, () => {});
                reject(err);
            });
        }
        
        doRequest(url);
    });
}

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  BeyondDev — Descarga de modelos face-api.js');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Crear carpeta models si no existe
    if (!fs.existsSync(MODELS_DIR)) {
        fs.mkdirSync(MODELS_DIR, { recursive: true });
        console.log(`📁 Carpeta creada: ${MODELS_DIR}\n`);
    }

    for (const fileName of FILES) {
        const url = `${BASE_URL}/${fileName}`;
        const dest = path.join(MODELS_DIR, fileName);

        if (fs.existsSync(dest)) {
            console.log(`  ✓ Ya existe: ${fileName}`);
            continue;
        }

        process.stdout.write(`  ↓ Descargando: ${fileName}... `);
        try {
            await downloadFile(url, dest);
            const size = fs.statSync(dest).size;
            console.log(`✓ (${(size / 1024).toFixed(1)} KB)`);
        } catch (err) {
            console.log(`✗ ERROR: ${err.message}`);
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  ✅ Descarga completada. Los modelos están en ./models/');
    console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
