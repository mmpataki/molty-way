import express from 'express';
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

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR);
}

const readYaml = (filePath: string) => {
    if (!fs.existsSync(filePath)) return null;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return yaml.load(content);
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
        return null;
    }
};

const writeYaml = (filePath: string, data: any) => {
    try {
        const content = yaml.dump(data);
        fs.writeFileSync(filePath, content, 'utf8');
    } catch (e) {
        console.error(`Error writing ${filePath}:`, e);
    }
};

app.get('/api/molties', (req, res) => {
    const data = readYaml(MOLTIES_FILE) || [];
    res.json(data);
});

app.post('/api/molties', (req, res) => {
    writeYaml(MOLTIES_FILE, req.body);
    res.json({ success: true });
});

app.get('/api/config', (req, res) => {
    const data = readYaml(CONFIG_FILE) || null;
    res.json(data);
});

app.post('/api/config', (req, res) => {
    writeYaml(CONFIG_FILE, req.body);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Backend storage server running at http://localhost:${PORT}`);
});
