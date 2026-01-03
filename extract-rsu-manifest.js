const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');

const manifest = {
    environment: {},
    apiEndpoints: [],
    constants: [],
    hooks: []
};

// 1. Extraction sécurisée des variables d'environnement
function getEnvVars() {
    const envPath = path.join(ROOT_DIR, '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            // On ignore les commentaires et les lignes vides
            if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
                const parts = trimmedLine.split('=');
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim(); // Gère les valeurs contenant un "="
                manifest.environment[key] = value;
            }
        });
    }
}

// 2. Scan récursif du dossier src
function scanSource(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanSource(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');

            // Extraction des appels API (fetch, axios, ou apiClient personnalisé)
            // Recherche les motifs comme .get('/path') ou fetch('/path')
            const apiRegex = /\.(get|post|put|delete|patch)\(['"`](.*?)['"`]\)/gi;
            let match;
            const routes = [];
            while ((match = apiRegex.exec(content)) !== null) {
                routes.push(`${match[1].toUpperCase()}: ${match[2]}`);
            }
            if (routes.length > 0) {
                manifest.apiEndpoints.push({ file: path.relative(SRC_DIR, fullPath), routes });
            }

            // Extraction des constantes exportées (MAJUSCULES)
            const constMatches = content.match(/export const ([A-Z0-9_]+)/g);
            if (constMatches) {
                manifest.constants.push({
                    file: path.relative(SRC_DIR, fullPath),
                    vars: constMatches.map(c => c.replace('export const ', ''))
                });
            }

            // Identification des Hooks
            if (fullPath.includes('hooks') && file.startsWith('use')) {
                manifest.hooks.push(path.relative(SRC_DIR, fullPath));
            }
        }
    });
}

console.log("🚀 Analyse du projet RSU Gabon Dashboard...");
getEnvVars();
scanSource(SRC_DIR);

// Nettoyage des doublons éventuels et formatage final
const report = {
    projet: "RSU Gabon Dashboard",
    version: manifest.environment['REACT_APP_VERSION'] || "Inconnue",
    api_base_url: manifest.environment['REACT_APP_API_URL'] || "Non définie",
    details: manifest
};

fs.writeFileSync('rsu_inventory.json', JSON.stringify(report, null, 2));

console.log("\n✅ Analyse terminée !");
console.log(`- Variables d'env : ${Object.keys(manifest.environment).length}`);
console.log(`- Fichiers de constantes : ${manifest.constants.length}`);
console.log(`- Hooks identifiés : ${manifest.hooks.length}`);
console.log("\nConsultez 'rsu_inventory.json' pour le détail complet.");