import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'PROJECT_REGISTRY.md');
const STATUS_PATH = path.join(ROOT, 'src/data/status.json');
const OUTPUT_PATH = path.join(ROOT, 'CONTEXT_PACK.md');

function main() {
    console.log("=== GENERATING CONTEXT_PACK.md ===");

    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error("ERROR: PROJECT_REGISTRY.md not found.");
        process.exit(1);
    }
    if (!fs.existsSync(STATUS_PATH)) {
        console.error("ERROR: src/data/status.json not found.");
        process.exit(1);
    }

    const registryParams = parseRegistry(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    const statusData = JSON.parse(fs.readFileSync(STATUS_PATH, 'utf-8'));

    const hubProject = statusData.find((p: any) => p.id === 7);
    const hubStatus = hubProject ? `${hubProject.assistedPhase || 'Unknown'} (Auditable ${hubProject.progressAuditable}%)` : 'Unknown';

    // Heuristic for "active task" from registry or fallback
    let activeTask = "<rellenar>";
    // Could parse "focusNow" from registry for HUB-007 but keeping simple for now.

    const content = `# CONTEXT PACK — pegar al iniciar un nuevo chat

Contexto:
- Owner: ${registryParams.owner || "Jorge Bonilla / IF&IF Studio 2026"}
- Repo HUB: ai-project-hub (GitHub Pages)
- Archivo maestro: PROJECT_REGISTRY.md (fuente de verdad)

Proyecto activo ahora:
- ID: HUB-007
- Nombre: The AI Project Hub (OFICIAL)
- Estado: ${hubStatus}
- Regla: IDs canónicos. Un proyecto existe cuando tiene ID + project.md (+ tasks.md si aplica)

Relación importante:
- PROG-016 — Odisea Travel Platform (umbrella)
  - ID 6 Viajes Backend
  - ID 8 Travel Booking UI

Qué necesito lograr en este chat:
- (1) …
- (2) …

_(Generado automáticamente el ${new Date().toISOString()})_
`;

    fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
    console.log(`SUCCESS: Created ${OUTPUT_PATH}`);
}

function parseRegistry(content: string): { owner?: string } {
    const lines = content.split('\n');
    let owner = "Jorge Bonilla / IF&IF Studio 2026"; // Default
    for (const line of lines) {
        if (line.startsWith("Owner:")) {
            owner = line.replace("Owner:", "").trim();
            break;
        }
    }
    return { owner };
}

main();
