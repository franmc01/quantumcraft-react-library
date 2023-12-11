import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs-extra';

const {readdirSync, writeFileSync} = fs;

// Obtén __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createPackageJsonForSubdirectories(parentDir) {
    // Asumiendo que 'dist' está en el directorio raíz de tu proyecto.
    const fullPath = join(__dirname, '..', '..', 'dist', parentDir); // Ajusta esta ruta según la estructura de tu proyecto.
    
    readdirSync(fullPath, {withFileTypes: true}).forEach((dirEntry) => {
        if (dirEntry.isDirectory()) {
            const componentDir = join(fullPath, dirEntry.name);
            const packageJsonPath = join(componentDir, 'package.json');

            const packageJson = {
                main: `./${dirEntry.name}.cjs.js`,
                module: `./${dirEntry.name}.esm.js`,
                typings: `./index.d.ts`,
            };

            writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
        }
    });
}

function run() {
    const moduleType = process.argv[2]; // El tipo de módulo se pasará como primer argumento al script.

    if (!moduleType) {
        console.error("Error: No se especificó el tipo de módulo. Usa 'hooks' o 'components'.");
        process.exit(1);
    }

    try {
        createPackageJsonForSubdirectories(moduleType);
    } catch (err) {
        console.error(`Error al generar package.json para ${moduleType}:`, err);
        process.exit(1);
    }
}

run();
