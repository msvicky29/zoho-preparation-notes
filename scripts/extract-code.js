import fs from 'fs'; 
import path from 'path'; 
 
const REPO_ROOT = process.cwd(); 
const OUTPUT_PATH = path.join(REPO_ROOT, 'data', 'problems.json'); 
 
const IGNORE_DIRS = new Set(['node_modules', '.git', 'frontend', '.github']); 
 
function findJavaFiles(dir, results = []) { 
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { 
    if (IGNORE_DIRS.has(entry.name)) continue; 
    const fullPath = path.join(dir, entry.name); 
    if (entry.isDirectory()) { 
      findJavaFiles(fullPath, results); 
    } else if (entry.isFile() && entry.name.endsWith('.java')) { 
      results.push(fullPath); 
    } 
  } 
  return results; 
} 
 
function parseMetadata(source) { 
  const start = source.indexOf('/**'); 
  if (start === -1) return null; 
  const end = source.indexOf('*/', start + 3); 
  const fullBlock = source.slice(start, end + 2); 
 
  const fields = {}; 
  for (const line of fullBlock.split(String.fromCharCode(10))) { 
    const at = line.indexOf('@'); 
    if (at === -1) continue; 
    const colon = line.indexOf(':', at); 
    if (colon === -1) continue; 
    const key = line.slice(at + 1, colon).trim().toLowerCase(); 
    const value = line.slice(colon + 1).trim(); 
    if (key) fields[key] = value; 
  } 
  return { fields, fullBlock }; 
}
 
function slugify(fileBaseName) { 
  let name = fileBaseName; 
  if (name.length  && name.toLowerCase().endsWith('.java')) { 
    name = name.slice(0, name.length - 5); 
  } 
  return name 
    .replace(/([a-z0-9])([A-Z])/g, (m, a, b) => a + '-' + b) 
    .toLowerCase(); 
} 
 
function stripJava(name) { 
  if (name.length  && name.toLowerCase().endsWith('.java')) { 
    name = name.slice(0, name.length - 5); 
  } 
  return name; 
} 
 
function buildEntry(filePath, source) { 
  const parsed = parseMetadata(source); 
  if (!parsed || !parsed.fields.question) { 
    console.log('Skipping ' + filePath + ' (no @question header found)'); 
    return null; 
  } 
 
  const relativePath = path.relative(REPO_ROOT, filePath); 
  const fileBaseName = path.basename(filePath); 
  const code = source.replace(parsed.fullBlock, '').trim(); 
 
  return { 
    id: slugify(fileBaseName), 
    title: parsed.fields.title || stripJava(fileBaseName), 
    question: parsed.fields.question, 
    topic: parsed.fields.topic || 'Uncategorized', 
    difficulty: parsed.fields.difficulty || 'Unknown', 
    platform: parsed.fields.platform || 'Unknown', 
    code, 
    filePath: relativePath, 
  }; 
} 
 
function loadExisting() { 
  if (!fs.existsSync(OUTPUT_PATH)) return []; 
  try { 
    return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8')); 
  } catch { 
    return []; 
  } 
} 
 
function main() { 
  const javaFiles = findJavaFiles(REPO_ROOT); 
  const existing = loadExisting(); 
  const byId = new Map(existing.map((p) => [p.id, p])); 
 
  for (const filePath of javaFiles) { 
    const source = fs.readFileSync(filePath, 'utf8'); 
    const entry = buildEntry(filePath, source); 
    if (!entry) continue; 
 
    const prior = byId.get(entry.id); 
    byId.set(entry.id, { 
      ...entry, 
      dateAdded: prior ? prior.dateAdded : new Date().toISOString().slice(0, 10), 
      lastRevised: prior ? prior.lastRevised : null, 
      revisionCount: prior ? prior.revisionCount : 0, 
    }); 
  } 
 
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true }); 
  const output = JSON.stringify(Array.from(byId.values()), null, 2); 
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8'); 
  console.log('Wrote ' + byId.size + ' problems to ' + OUTPUT_PATH); 
} 
 
main();
