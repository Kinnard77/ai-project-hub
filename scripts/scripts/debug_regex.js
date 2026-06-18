const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../PROJECT_REGISTRY.md');
const content = fs.readFileSync(REGISTRY_PATH, 'utf-8');
const lines = content.split('\n');

// Try a very permissive regex to see what we capture
// ## [CODE] ... (ID [NUM])
const permissiveRegex = /##\s+(.*?)\s+\(ID\s+(\d+)\)/;

console.log(`Analyzing ${lines.length} lines from Registry...`);

lines.forEach((line, index) => {
    if (line.trim().startsWith('##')) {
        console.log(`\nLine ${index + 1}: ${line.trim()}`);

        const strictRegex = /##\s+([A-Z]+-\d+)\s+.\s+(.*?)\s+\(ID\s+(\d+)\)/;
        const match = line.match(strictRegex);

        if (match) {
            console.log(`  MATCH STRICT: Code=${match[1]} Name=${match[2]} ID=${match[3]}`);
        } else {
            console.log(`  NO MATCH STRICT`);
            const permMatch = line.match(permissiveRegex);
            if (permMatch) {
                console.log(`  MATCH PERMISSIVE: Part1="${permMatch[1]}" ID=${permMatch[2]}`);
                // Analyze the separator
                const part1 = permMatch[1];
                // Expect [CODE] [sep] [NAME]
                // Split by space?
                console.log(`  Hex dump of Part1:`);
                for (let i = 0; i < part1.length; i++) {
                    process.stdout.write(`${part1.charCodeAt(i).toString(16)} `);
                }
                console.log('');
            }
        }
    }
});
