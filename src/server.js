const http = require('http');
const { add, subtract, multiply, divide, calculateDiscount, validateEmail } = require('./calculator');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    // Health check endpoint
    if (pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'UP', timestamp: new Date().toISOString() }));
    }

    // Calculator API endpoint
    if (pathname === '/api/calculate') {
        const op = query.op || 'add';
        const a = parseFloat(query.a) || 0;
        const b = parseFloat(query.b) || 0;

        let result;
        try {
            switch (op) {
                case 'add':
                    result = add(a, b);
                    break;
                case 'subtract':
                    result = subtract(a, b);
                    break;
                case 'multiply':
                    result = multiply(a, b);
                    break;
                case 'divide':
                    result = divide(a, b);
                    break;
                default:
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Unknown operation: ${op}` }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ operation: op, a, b, result }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    // Web UI Home
    if (pathname === '/' && req.method === 'GET') {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jenkins Calculator & Security Demo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: #1e293b; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); max-width: 480px; width: 100%; border: 1px solid #334155; }
        h1 { color: #38bdf8; font-size: 1.5rem; margin-top: 0; }
        p { color: #94a3b8; font-size: 0.9rem; }
        .badge { display: inline-block; background: #0284c7; color: white; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; margin-bottom: 1rem; }
        .input-group { margin-bottom: 1rem; }
        label { display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 0.3rem; }
        input, select, button { width: 100%; box-sizing: border-box; padding: 0.6rem; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #f8fafc; }
        button { background: #2563eb; border: none; font-weight: bold; cursor: pointer; margin-top: 0.5rem; }
        button:hover { background: #1d4ed8; }
        #output { margin-top: 1rem; padding: 0.8rem; background: #0f172a; border-radius: 6px; border: 1px solid #334155; font-family: monospace; font-size: 0.85rem; word-break: break-all; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">OWASP ZAP DAST Target</span>
        <h1>Jenkins Demo App</h1>
        <p>A Node.js web application equipped for automated security scanning in Jenkins CI/CD.</p>
        <div class="input-group">
            <label for="numA">Operand A</label>
            <input type="number" id="numA" value="10">
        </div>
        <div class="input-group">
            <label for="op">Operation</label>
            <select id="op">
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (-)</option>
                <option value="multiply">Multiply (*)</option>
                <option value="divide">Divide (/)</option>
            </select>
        </div>
        <div class="input-group">
            <label for="numB">Operand B</label>
            <input type="number" id="numB" value="5">
        </div>
        <button onclick="calculate()">Calculate</button>
        <div id="output">Status: Ready. Waiting for input...</div>
    </div>

    <script>
        async function calculate() {
            const a = document.getElementById('numA').value;
            const b = document.getElementById('numB').value;
            const op = document.getElementById('op').value;
            const out = document.getElementById('output');
            out.textContent = 'Calculating...';
            try {
                const res = await fetch('/api/calculate?op=' + op + '&a=' + a + '&b=' + b);
                const data = await res.json();
                out.textContent = JSON.stringify(data, null, 2);
            } catch (err) {
                out.textContent = 'Error: ' + err.message;
            }
        }
    </script>
</body>
</html>`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
    }

    // 404 handler
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
});

if (require.main === module) {
    server.listen(PORT, HOST, () => {
        console.log(`[SERVER] Calculator app listening on http://${HOST}:${PORT}`);
    });
}

module.exports = server;
