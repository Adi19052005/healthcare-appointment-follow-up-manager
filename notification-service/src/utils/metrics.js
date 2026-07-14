const metrics = {
    fcm: {
        success: 0,
        failure: 0,
        removedTokens: 0,
    },
};

function inc(path, n = 1) {
    const parts = path.split('.');
    let cur = metrics;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        cur[p] = cur[p] || {};
        cur = cur[p];
    }
    const last = parts[parts.length - 1];
    cur[last] = (cur[last] || 0) + n;
}

function getAll() {
    return metrics;
}

module.exports = { inc, getAll };
