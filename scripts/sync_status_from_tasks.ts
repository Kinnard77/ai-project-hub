import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


interface TaskCounts {
    total: number;
    done: number;
    pendingTasks: string[];
}

interface ProjectConfig {
    id: number;
    name: string;
    tasksPath: string;
}

const PROJECTS: ProjectConfig[] = [
    { id: 1, name: "Odisea Challenge (Frontend)", tasksPath: "../../OdiseaChallenge/tasks.md" },
    { id: 5, name: "Micropasos App", tasksPath: "../../Micropasos App/micropasos---app/tasks.md" },
    { id: 7, name: "The AI Project Hub", tasksPath: "../tasks.md" }, // Auto-reference
    { id: 10, name: "Agente Operativo: Arquitecto Silencioso", tasksPath: "../../AgenteOperativo/tasks.md" },
    { id: 15, name: "UMBRA", tasksPath: "../../UMBRA/tasks.md" }
];

const OWNER_CANON = "Jorge Bonilla/IF&IF Studio 2026";

const STATUS_JSON_PATH = path.join(__dirname, "../src/data/status.json");
const AUDIT_LOG_PATH = path.join(__dirname, "sync_audit.log");


function todayYYYYMMDD(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function isoNow(): string {
    return new Date().toISOString();
}

function parseTasksMd(filePath: string): TaskCounts | null {
    const fullPath = path.resolve(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return null;

    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");

    let total = 0;
    let done = 0;
    const pendingTasks: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- [x]") || trimmed.startsWith("- [/]")) {
            total++;
            if (trimmed.startsWith("- [x]")) {
                done++;
            } else {
                const taskName = trimmed.replace(/^- \[[ x\/]\] /, "").trim();
                pendingTasks.push(taskName);
            }
        }
    }

    return { total, done, pendingTasks };
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

function appendAudit(line: string) {
    fs.appendFileSync(AUDIT_LOG_PATH, line + "\n", "utf-8");
}

function validateStatusData(statusData: any): { ok: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(statusData)) {
        return { ok: false, errors: ["status.json root must be an array"] };
    }

    const seenIds = new Set<number>();

    for (let i = 0; i < statusData.length; i++) {
        const p = statusData[i];

        // Block legacy fields
        if (p && (Object.prototype.hasOwnProperty.call(p, "progress") || Object.prototype.hasOwnProperty.call(p, "milestones"))) {
            errors.push(`Project index ${i} contains legacy fields "progress" or "milestones"`);
        }

        if (typeof p?.id !== "number") errors.push(`Project index ${i} missing id:number`);
        if (typeof p?.name !== "string") errors.push(`Project index ${i} missing name:string`);

        if (typeof p?.lastUpdate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.lastUpdate)) {
            errors.push(`Project id ${p?.id ?? i} invalid lastUpdate (expected YYYY-MM-DD)`);
        }

        if (typeof p?.progressAssisted !== "number") {
            errors.push(`Project id ${p?.id ?? i} missing progressAssisted:number`);
        }

        const pa = p?.progressAuditable;
        if (!(pa === null || typeof pa === "number")) {
            errors.push(`Project id ${p?.id ?? i} progressAuditable must be number|null`);
        }

        const ts = p?.tasksSummary;
        if (!(ts === null || ts === undefined ||
            (typeof ts?.total === "number" && typeof ts?.done === "number" && typeof ts?.pending === "number"))) {
            errors.push(`Project id ${p?.id ?? i} tasksSummary must be null or {total,done,pending} numbers`);
        }

        if (typeof p?.id === "number") {
            if (seenIds.has(p.id)) errors.push(`Duplicate project id: ${p.id}`);
            seenIds.add(p.id);
        }
    }

    return { ok: errors.length === 0, errors };
}

function sync() {
    console.log("=== INICIO DE SINCRONIZACIÓN DETERMINISTA (SYNC v2) ===\n");

    const statusRaw = fs.readFileSync(STATUS_JSON_PATH, "utf-8");
    const statusData = JSON.parse(statusRaw);

    const changedProjects: Array<{ id: number; name: string; before: any; after: any }> = [];

    for (const config of PROJECTS) {
        const projectIndex = statusData.findIndex((p: any) => p?.id === config.id);
        if (projectIndex === -1) {
            console.warn(`[!] Proyecto ${config.name} (ID: ${config.id}) no encontrado en status.json`);
            continue;
        }

        const project = statusData[projectIndex];

        // Ensure owner (non-destructive)
        if (!project.owner) project.owner = OWNER_CANON;

        const before = {
            progressAuditable: project.progressAuditable ?? null,
            tasksSummary: project.tasksSummary ?? null,
            tasksSourceResolved: project.tasksSourceResolved ?? null,
            pendingFocus: project.pendingFocus ?? null,
            lastUpdate: project.lastUpdate
        };

        const counts = parseTasksMd(config.tasksPath);

        // Resolve abs path if exists
        const absTasksPath = path.resolve(__dirname, config.tasksPath);
        const tasksExists = fs.existsSync(absTasksPath);

        if (!counts) {
            // tasks.md missing
            // Keep null if project had no tasksSource; otherwise set 0 to signal missing file but expected.
            if (project.tasksSource == null) {
                project.progressAuditable = null;
                project.tasksSummary = null;
            } else {
                project.progressAuditable = 0;
                project.tasksSummary = { total: 0, done: 0, pending: 0 };
            }
            project.tasksSourceResolved = tasksExists ? absTasksPath : null;
        } else {
            const { total, done } = counts;
            if (total === 0) {
                // Empty tasks
                project.progressAuditable = (project.tasksSource == null) ? null : 0;
                project.tasksSummary = (project.tasksSource == null) ? null : { total: 0, done: 0, pending: 0 };
            } else {
                const pending = total - done;
                project.tasksSummary = { total, done, pending };
                project.progressAuditable = round2((done / total) * 100);
                project.pendingFocus = counts.pendingTasks;
            }
            project.tasksSourceResolved = absTasksPath;
        }

        const after = {
            progressAuditable: project.progressAuditable ?? null,
            tasksSummary: project.tasksSummary ?? null,
            tasksSourceResolved: project.tasksSourceResolved ?? null,
            pendingFocus: project.pendingFocus ?? null,
            lastUpdate: project.lastUpdate
        };

        const changed =
            JSON.stringify(before.progressAuditable) !== JSON.stringify(after.progressAuditable) ||
            JSON.stringify(before.tasksSummary) !== JSON.stringify(after.tasksSummary) ||
            JSON.stringify(before.tasksSourceResolved) !== JSON.stringify(after.tasksSourceResolved) ||
            JSON.stringify(before.pendingFocus) !== JSON.stringify(after.pendingFocus);

        if (changed) {
            project.lastUpdate = todayYYYYMMDD();
            after.lastUpdate = project.lastUpdate;
            changedProjects.push({ id: project.id, name: project.name, before, after });
        }

        console.log(`Auditoría: ${config.name}`);
        console.log(`- tasksPath: ${config.tasksPath}`);
        console.log(`- before: ${JSON.stringify(before)}`);
        console.log(`- after : ${JSON.stringify(after)}`);
        console.log("");
    }

    // Validate BEFORE write
    const validation = validateStatusData(statusData);
    if (!validation.ok) {
        const header = `=== SYNC FAIL ${isoNow()} ===`;
        appendAudit(header);
        for (const err of validation.errors) appendAudit(`ERROR: ${err}`);
        appendAudit("NO WRITE PERFORMED.");
        console.error("VALIDATION FAILED. status.json NOT UPDATED.");
        validation.errors.forEach(e => console.error(" - " + e));
        process.exit(1);
    }

    if (changedProjects.length > 0) {
        fs.writeFileSync(STATUS_JSON_PATH, JSON.stringify(statusData, null, 4), "utf-8");

        appendAudit(`=== SYNC OK ${isoNow()} ===`);
        appendAudit(`Changed projects: ${changedProjects.length}`);
        for (const cp of changedProjects) {
            appendAudit(`- ${cp.id} | ${cp.name}`);
            appendAudit(`  before: ${JSON.stringify(cp.before)}`);
            appendAudit(`  after : ${JSON.stringify(cp.after)}`);
        }
        appendAudit("");

        console.log("=== status.json ACTUALIZADO CORRECTAMENTE ===");
    } else {
        appendAudit(`=== SYNC NO-OP ${isoNow()} === Changed projects: 0\n`);
        console.log("=== SIN CAMBIOS PENDIENTES EN status.json ===");
    }
}

sync();
