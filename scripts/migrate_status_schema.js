import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATUS_JSON_PATH = path.join(__dirname, '../src/data/status.json');

function migrate() {
    if (!fs.existsSync(STATUS_JSON_PATH)) {
        console.error("No se encuentra status.json");
        return;
    }

    const data = JSON.parse(fs.readFileSync(STATUS_JSON_PATH, 'utf-8'));

    const migrated = data.map(project => {
        // Preservar valores existentes o poner defaults
        const currentProgress = project.progress || 0;

        return {
            ...project,
            assistedProgress: currentProgress, // Por ahora igualamos al progreso anterior
            auditableProgress: (project.progressSource === 'tasks.md') ? currentProgress : 0,
            expertAnalysis: {
                phase: project.status === "Active" ? "Ejecución" : "Planeación",
                reasons: project.highlights ? project.highlights.slice(0, 5) : ["Pendiente de análisis experto"],
                missingTypical: "Documentación y Pruebas Unitarias"
            },
            auditableTasks: {
                total: 0,
                completed: 0,
                list: []
            }
        };
    });

    // Eliminar el progreso viejo para evitar confusión
    migrated.forEach(p => delete p.progress);

    fs.writeFileSync(STATUS_JSON_PATH, JSON.stringify(migrated, null, 4));
    console.log("Migración completada.");
}

migrate();
