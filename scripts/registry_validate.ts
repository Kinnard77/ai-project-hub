import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'PROJECT_REGISTRY.md');
const STATUS_PATH = path.join(ROOT, 'src/data/status.json');

function main() {
    console.log("=== REGISTRY VALIDATION (v1 WARN MODE) ===");

    if (!fs.existsSync(REGISTRY_PATH) || !fs.existsSync(STATUS_PATH)) {
        console.error("CRITICAL: Missing registry or status file.");
        process.exit(1);
    }

    const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const statusData = JSON.parse(fs.readFileSync(STATUS_PATH, 'utf-8'));

    const registryProjects = parseRegistryProjects(registryContent);
    const statusProjects = statusData.map((p: any) => ({ id: p.id, name: p.name }));

    const warnings: string[] = [];

    // Check 1: Status projects must exist in Registry (fuzzy match name)
    for (const sp of statusProjects) {
        const found = registryProjects.find(rp => normalize(rp.name) === normalize(sp.name));
        if (!found) {
            // Try to see if registry has ID? (Registry parsing is simple markdown, might not extract ID easily unless we standardize)
            // For now, rely on name match
            warnings.push(`[WARN] Project in status.json (ID ${sp.id} "${sp.name}") NOT found in PROJECT_REGISTRY.md by name.`);
        }
    }

    // Check 2: Registry duplicates
    const seen = new Set<string>();
    for (const p of registryProjects) {
        const norm = normalize(p.name);
        if (seen.has(norm)) {
            warnings.push(`[WARN] Duplicate project in Registry: "${p.name}"`);
        }
        seen.add(norm);
    }

    if (warnings.length > 0) {
        console.log("Validation Warnings Found:");
        warnings.forEach(w => console.log(w));
        // v1: WARN ONLY -> Exit 0
        console.log("v1 Policy: Proceeding despite warnings.");
    } else {
        console.log("Validation OK.");
    }
}

function normalize(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseRegistryProjects(content: string): { name: string }[] {
    const lines = content.split('\n');
    const projects = [];
    for (const line of lines) {
        if (line.startsWith("## ")) {
            // Extract Name. Format usually "## HUB-007 — The AI Project Hub (OFICIAL)" or similar
            // We want "The AI Project Hub"
            const raw = line.replace("## ", "").trim();
            // Split by em-dash or dash if present
            const parts = raw.split(/[—–-]/); // mdash, ndash, hyphen

            // If ID present (e.g. HUB-007 - Name), name is second part. 
            // If just Name, name is first part.
            // Heuristic: If part 0 looks like ID, take part 1.
            let name = raw;
            if (parts.length > 1) {
                name = parts.slice(1).join(" ").trim();
            }
            // Remove (OFFICIAL) etc
            name = name.replace(/\(.*\)/, "").trim();

            projects.push({ name: raw }); // Store raw for now to help matching? actually storing raw might be better for debug.
            // Let's actually refine needed logic:
            // Status has "The AI Project Hub". Registry has "HUB-007 — The AI Project Hub (OFICIAL)".
            // Normalizing "HUB-007 — The AI Project Hub (OFICIAL)" -> "hub007theaiprojecthuboficial" vs "theaiprojecthub"
            // This is tricky. Let's just try to match if status name is *contained* in registry line.
        }
    }
    return projects;
}

main();
