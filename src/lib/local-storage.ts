import { promises as fs } from 'fs';
import path from 'path';

const LOCAL_DATA_DIR = path.join(process.cwd(), '.local-data');

// Ensure local data directory exists
async function ensureDir() {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating local data directory:', error);
  }
}

/**
 * Save data to local JSON file (replaces existing data)
 */
export async function saveLocalData(collection: string, data: any): Promise<void> {
  await ensureDir();
  const filePath = path.join(LOCAL_DATA_DIR, `${collection}.json`);
  
  const payload = {
    collection,
    updatedAt: new Date().toISOString(),
    data
  };
  
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`[LocalStorage] Saved ${collection} to ${filePath}`);
}

/**
 * Load data from local JSON file
 */
export async function loadLocalData(collection: string): Promise<any | null> {
  try {
    const filePath = path.join(LOCAL_DATA_DIR, `${collection}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    console.log(`[LocalStorage] Loaded ${collection} from ${filePath}`);
    return parsed.data;
  } catch (error) {
    // File doesn't exist or is invalid
    return null;
  }
}

/**
 * Append data to local collection (for multiple items)
 */
export async function appendLocalData(collection: string, item: any): Promise<void> {
  const existing = await loadLocalData(collection) || [];
  const data = Array.isArray(existing) ? existing : [existing];
  
  // Check if item with same ID exists, replace it
  const index = data.findIndex((d: any) => d.id === item.id);
  if (index >= 0) {
    data[index] = { ...data[index], ...item, updatedAt: new Date().toISOString() };
  } else {
    data.push({ ...item, createdAt: new Date().toISOString() });
  }
  
  await saveLocalData(collection, data);
}

/**
 * Delete item from local collection
 */
export async function deleteLocalData(collection: string, id: string): Promise<void> {
  const existing = await loadLocalData(collection) || [];
  if (!Array.isArray(existing)) return;
  
  const data = existing.filter((item: any) => item.id !== id);
  await saveLocalData(collection, data);
}

/**
 * List all local collections
 */
export async function listLocalCollections(): Promise<string[]> {
  try {
    await ensureDir();
    const files = await fs.readdir(LOCAL_DATA_DIR);
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
  } catch {
    return [];
  }
}

/**
 * Clear all local data
 */
export async function clearAllLocalData(): Promise<void> {
  try {
    const collections = await listLocalCollections();
    for (const collection of collections) {
      const filePath = path.join(LOCAL_DATA_DIR, `${collection}.json`);
      await fs.unlink(filePath);
    }
    console.log('[LocalStorage] All local data cleared');
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
}

/**
 * Check if running in localhost/development mode
 */
export function isLocalhostMode(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.USE_LOCAL_STORAGE === 'true';
}
