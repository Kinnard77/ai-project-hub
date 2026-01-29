import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = "C:\\Users\\illus\\PROYECTOS_IA_MASTER\\";
const STATUS_JSON_PATH = path.join(__dirname, "../src/data/status.json");
const AUDIT_LOG_PATH = path.join(__dirname, "sync_audit.log");

const OWNER_CANON = "Jorge Bonilla/IF&IF Studio 2026";

function isoNow() {
    return new Date().toISOString();
}

function todayYYYYMMDD(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function appendAudit(line: string) {
    fs.appendFileSync(AUDIT_LOG_PATH, line + "\n", "utf-8");
}

function looksLikeProjectFolder(folderPath: string): boolean {
    const candidates = ["tasks.md", "project.md", "hub.project.json"];
    return candidates.some((f) => fs.existsSync(path.join(folderPath, f)));
}

function safeReadStatus(): any[] {
    const raw = fs.readFileSync(STATUS_JSON_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error("status.json root must be an array");
    return data;
}

function nextId(statusData: any[]): number {
    const ids = statusData.map((p) => (typeof p?.id === "number" ? p.id : 0));
    return Math.max(0, ...ids) + 1;
}

function relTasksSource(projectFolderName: string): string | null {
    const abs = path.join(ROOT, projectFolderName, "tasks.md");
    if (!fs.existsSync(abs)) return null;

    // status.json lives in The AI Projects Hub App/src/data
    // tasksSource convention in your file is relative (e.g., "../OdiseaChallenge/tasks.md")
    // For newly discovered projects, we keep it relative to the Hub app folder:
    return `../${projectFolderName}/tasks.md`;
}

function resolveTasksSource(projectFolderName: string): string | null {
    const abs = path.join(ROOT, projectFolderName, "tasks.md");
    return fs.existsSync(abs) ? abs : null;
}

function makeDefaultCard(projectFolderName: string, id: number) {
    const tasksSource = relTasksSource(projectFolderName);
    const tasksSourceResolved = resolveTasksSource(projectFolderName);

    return {
        id,
        name: projectFolderName,
        status: "Planning",
        theme: "violet",
        tech: "TBD",
        lastUpdate: todayYYYYMMDD(),
        description: "Proyecto detectado automáticamente. Pendiente de definición por el Arquitecto.",
        owner: OWNER_CANON,

        progressAssisted: 0,
        progressAuditable: null,
        assistedPhase: "Planeación",
        assistedSignals: ["🧭 Auto-discovery: proyecto detectado. Pendiente autorización del Arquitecto."],

        tasksSource,
        tasksSourceResolved,
        tasksSummary: null,

        pendingFocus: ["Definir objetivo", "Autorizar tasks (tasks.md)"],
    };
}

function main() {
    if (!fs.existsSync(ROOT)) {
        console.error(`ROOT no existe: ${ROOT}`);
        process.exit(1);
    }

    const statusData = safeReadStatus();
    const existingNames = new Set(statusData.map((p: any) => String(p?.name ?? "").toLowerCase()));
    const rootEntries = fs.readdirSync(ROOT, { withFileTypes: true });

    const discovered: string[] = [];

    for (const entry of rootEntries) {
        if (!entry.isDirectory()) continue;

        const folderName = entry.name;
        const folderPath = path.join(ROOT, folderName);

        if (!looksLikeProjectFolder(folderPath)) continue;

        const key = folderName.toLowerCase();
        if (existingNames.has(key)) continue;

        const id = nextId(statusData);
        const card = makeDefaultCard(folderName, id);
        statusData.push(card);
        existingNames.add(key);
        discovered.push(folderName);
    }

    appendAudit(`=== DISCOVER ${isoNow()} ===`);
    appendAudit(`ROOT: ${ROOT}`);
    appendAudit(`Discovered: ${discovered.length}`);
    for (const n of discovered) appendAudit(`- ${n}`);
    appendAudit("");

    if (discovered.length > 0) {
        fs.writeFileSync(STATUS_JSON_PATH, JSON.stringify(statusData, null, 4), "utf-8");
        console.log(`DISCOVER OK: añadidos ${discovered.length} proyectos.`);
    } else {
        console.log("DISCOVER NO-OP: no se detectaron proyectos nuevos.");
    }
}

main();
