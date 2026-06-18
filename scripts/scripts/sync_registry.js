const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../PROJECT_REGISTRY.md');
const STATUS_JSON_PATH = path.join(__dirname, '../The AI Projects Hub App/src/data/status.json');
const LOG_PATH = path.join(__dirname, 'sync_log.txt');

function log(msg) {
    try {
        fs.appendFileSync(LOG_PATH, msg + '\n');
    } catch (e) {
        console.error('Error writing to log:', e);
    }
    console.log(msg);
}

// Clear log
try {
    fs.writeFileSync(LOG_PATH, '');
} catch (e) {
    console.error('Error clearing log:', e);
}

function parseRegistry(content) {
    const projects = [];
    const lines = content.split('\n');
    let currentProject = null;

    // Regex to match: ## [CODE] ... [NAME] (ID [NUM])
    // Capture everything between Code and ID, then clean up separator.
    const idRegex = /##\s*([A-Z]+-\d+)\s+(.*?)\s+\(ID\s+(\d+)\)/;

    lines.forEach((line, index) => {
        if (line.trim().startsWith('##')) {
            const match = line.match(idRegex);
            if (!match) {
                log(`[FAIL] Line ${index + 1}: "${line}"`);
            } else {
                let cleanName = match[2].trim().replace(/^[—–-]\s*/, '').trim();
                log(`[OK]   Line ${index + 1}: Code=${match[1]} ID=${match[3]} Name="${cleanName}"`);
            }
        }
    });

    for (const line of lines) {
        const idMatch = line.match(idRegex);
        if (idMatch) {
            if (currentProject) {
                projects.push(currentProject);
                log(`   -> Saved Project ${currentProject.code} (Keys: ${Object.keys(currentProject.rawConfig).join(', ')})`);
            }
            let cleanName = idMatch[2].trim().replace(/^[—–-]\s*/, '').trim();
            currentProject = {
                code: idMatch[1],
                name: cleanName,
                id: parseInt(idMatch[3], 10),
                rawConfig: {}
            };
            continue;
        }

        if (currentProject && line.trim().startsWith('-')) {
            const parts = line.trim().substring(1).split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                currentProject.rawConfig[key] = value;
            }
        }
    }
    if (currentProject) {
        projects.push(currentProject);
        log(`   -> Saved Project ${currentProject.code} (Keys: ${Object.keys(currentProject.rawConfig).join(', ')})`);
    }
    return projects;
}

function sync() {
    log(`Reading Registry from: ${REGISTRY_PATH}`);
    if (!fs.existsSync(REGISTRY_PATH)) {
        log('ERROR: Registry file not found!');
        return;
    }
    const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const registryProjects = parseRegistry(registryContent);

    log(`Found ${registryProjects.length} projects in Registry.`);

    log(`Reading status.json from: ${STATUS_JSON_PATH}`);
    if (!fs.existsSync(STATUS_JSON_PATH)) {
        log('ERROR: status.json file not found!');
        return;
    }
    const statusJson = JSON.parse(fs.readFileSync(STATUS_JSON_PATH, 'utf-8'));

    let updates = 0;

    registryProjects.forEach(regProj => {
        const jsonProj = statusJson.find(p => p.id === regProj.id);
        if (jsonProj) {
            let modified = false;
            // log(`Checking ID ${regProj.id}...`);

            // Sync Status
            if (regProj.rawConfig.status) {
                if (jsonProj.status !== regProj.rawConfig.status) {
                    log(`  [UPDATE] ID ${jsonProj.id} Status: "${jsonProj.status}" -> "${regProj.rawConfig.status}"`);
                    jsonProj.status = regProj.rawConfig.status;
                    modified = true;
                }
            }

            // Sync Phase
            if (regProj.rawConfig.phase) {
                if (jsonProj.assistedPhase !== regProj.rawConfig.phase) {
                    log(`  [UPDATE] ID ${jsonProj.id} Phase: "${jsonProj.assistedPhase}" -> "${regProj.rawConfig.phase}"`);
                    jsonProj.assistedPhase = regProj.rawConfig.phase;
                    modified = true;
                }
            }

            // Sync Focus (Registry 'focusNow' -> JSON 'humanContext.nextStep')
            if (regProj.rawConfig.focusNow) {
                if (!jsonProj.humanContext) jsonProj.humanContext = {};
                if (jsonProj.humanContext.nextStep !== regProj.rawConfig.focusNow) {
                    log(`  [UPDATE] ID ${jsonProj.id} Next Step: "${jsonProj.humanContext.nextStep}" -> "${regProj.rawConfig.focusNow}"`);
                    jsonProj.humanContext.nextStep = regProj.rawConfig.focusNow;
                    modified = true;
                }
            }

            // CLEANUP: Remove absolute path leakage if present
            if (jsonProj.tasksSourceResolved) {
                delete jsonProj.tasksSourceResolved;
                modified = true;
                log(`  [CLEANUP] Removed absolute path from ID ${jsonProj.id}`);
            }

            if (modified) updates++;
        } else {
            log(`[INFO] Project ID ${regProj.id} found in Registry but NOT in status.json. Creating it...`);

            const newProject = {
                id: regProj.id,
                name: regProj.name || `Project ${regProj.code}`,
                status: regProj.rawConfig.status || 'Planning',
                theme: 'slate', // default
                tech: regProj.rawConfig.tech || 'TBD',
                lastUpdate: new Date().toISOString().split('T')[0],
                description: regProj.rawConfig.notes || 'No description.',
                progressAssisted: 0,
                progressAuditable: 0,
                assistedPhase: regProj.rawConfig.phase || 'Conceptualization',
                assistedSignals: [],
                humanContext: {
                    summary: regProj.rawConfig.notes || '',
                    nextStep: regProj.rawConfig.focusNow || 'Initial setup',
                    nextStepWhy: 'New project registration.'
                },
                tasksSource: regProj.rawConfig.repoFolder ? `../${regProj.rawConfig.repoFolder}/tasks.md` : null,
                tasksSummary: { total: 0, done: 0, pending: 0 },
                pendingFocus: [],
                owner: "Jorge Bonilla/IF&IF Studio 2026"
            };

            // Handle optional fields
            if (regProj.rawConfig.repoFolder) {
                // Try to resolve path
                // (DISABLED: Do not put absolute local paths in shared JSON)
                // newProject.tasksSourceResolved = path.resolve(__dirname, `../${regProj.rawConfig.repoFolder}/tasks.md`);
            }

            statusJson.push(newProject);
            updates++;
            log(`  [CREATE] Added ID ${regProj.id} to status.json`);
        }
    });

    if (updates > 0) {
        fs.writeFileSync(STATUS_JSON_PATH, JSON.stringify(statusJson, null, 4));
        log(`\nSUCCESS: Updated ${updates} projects in status.json`);
    } else {
        log('\nNO CHANGE: status.json was already in sync with Registry.');
    }
}

sync();
