import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const STORAGE_DIR = path.join(__dirname, '../storage');
const MOLTIES_FILE = path.join(STORAGE_DIR, 'molties.yaml');
const CONFIG_FILE = path.join(STORAGE_DIR, 'config.yaml');

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

const readYaml = (filePath: string) => {
    if (!fs.existsSync(filePath)) return null;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return yaml.load(content) || null;
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
        return null;
    }
};

const writeYaml = (filePath: string, data: any) => {
    try {
        const content = yaml.dump(data);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully wrote to ${filePath}`);
    } catch (e) {
        console.error(`Error writing ${filePath}:`, e);
    }
};

app.get('/api/molties', (req: Request, res: Response) => {
    try {
        let data = readYaml(MOLTIES_FILE);
        if (data === null) {
            data = [];
        } else if (!Array.isArray(data)) {
            data = [data]; // Wrap in array if it somehow became an object
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('GET /api/molties Error:', err);
        res.status(500).json({ error: 'Failed to read molties' });
    }
});

app.post('/api/molties', (req: Request, res: Response) => {
    try {
        writeYaml(MOLTIES_FILE, req.body);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('POST /api/molties Error:', err);
        res.status(500).json({ error: 'Failed to save molties' });
    }
});

app.get('/api/config', (req: Request, res: Response) => {
    try {
        const data = readYaml(CONFIG_FILE) || null;
        res.status(200).json(data);
    } catch (err) {
        console.error('GET /api/config Error:', err);
        res.status(500).json({ error: 'Failed to read config' });
    }
});

app.post('/api/config', (req: Request, res: Response) => {
    try {
        writeYaml(CONFIG_FILE, req.body);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('POST /api/config Error:', err);
        res.status(500).json({ error: 'Failed to save config' });
    }
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend storage server running at http://localhost:${PORT}`);
});

// Keep process from exiting
process.stdin.resume();

process.on('SIGINT', () => {
    console.log('SIGINT received. Closing server...');
    server.close(() => {
        console.log('Server closed. Exiting.');
        process.exit(0);
    });
});
