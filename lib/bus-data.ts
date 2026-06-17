import path from 'path';
import fs from 'fs/promises';
import { BusRoute } from '@/types/bus';

export async function getBusRoutes(): Promise<BusRoute[]> {
  const dataDir = path.join(process.cwd(), 'public', 'data', 'bus');
  
  try {
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const routes: BusRoute[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      try {
        const data = JSON.parse(content) as BusRoute;
        routes.push(data);
      } catch (e) {
        console.error(`Failed to parse bus data: ${file}`, e);
      }
    }
    
    return routes;
  } catch (e) {
    console.error('Failed to read bus data directory', e);
    return [];
  }
}
