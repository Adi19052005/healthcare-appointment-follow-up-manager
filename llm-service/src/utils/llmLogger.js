const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'llm_responses.log');
const MAX_BACKUPS = 5;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

async function saveRaw(entry) {
    try {
        ensureLogDir();
        const record = {
            ts: new Date().toISOString(),
            ...entry,
        };
        const line = JSON.stringify(record) + '\n';
        fs.appendFileSync(LOG_FILE, line);

        // Rotate if file too large
        try {
            const stats = fs.statSync(LOG_FILE);
            if (stats.size > MAX_BYTES) {
                // shift backups
                for (let i = MAX_BACKUPS - 1; i >= 0; i--) {
                    const src = i === 0 ? LOG_FILE : `${LOG_FILE}.${i}`;
                    const dest = `${LOG_FILE}.${i + 1}`;
                    if (fs.existsSync(src)) {
                        fs.renameSync(src, dest);
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to rotate LLM log', e);
        }
    } catch (err) {
        console.error('Failed to write LLM log', err);
    }
}

function readRecent(n = 100) {
    try {
        if (!fs.existsSync(LOG_FILE)) return [];
        const data = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = data.split(/\r?\n/).filter(Boolean);
        return lines.slice(-n).map((l) => {
            try { return JSON.parse(l); } catch (e) { return { raw: l }; }
        });
    } catch (err) {
        console.error('Failed to read LLM log', err);
        return [];
    }
}

module.exports = { saveRaw, readRecent };
