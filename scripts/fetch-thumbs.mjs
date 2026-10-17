// Downloads YouTube trailer thumbnails into public/video/ so pages
// make no requests to YouTube until a visitor presses play.
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const gamesDir = 'content/games';
const outDir = 'public/video';

function collectIds(game) {
  const trailers = [game.trailer, ...(game.dlc ?? []).map((d) => d.trailer)];
  return trailers.flatMap((t) => Object.values(t ?? {})).filter(Boolean);
}

await mkdir(outDir, { recursive: true });
const ids = new Set();
for (const file of await readdir(gamesDir)) {
  if (!file.endsWith('.json')) continue;
  const game = JSON.parse(await readFile(path.join(gamesDir, file), 'utf8'));
  collectIds(game).forEach((id) => ids.add(id));
}

for (const id of ids) {
  const target = path.join(outDir, `${id}.jpg`);
  try {
    await access(target);
    continue;
  } catch {}
  const res = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  if (!res.ok) throw new Error(`Thumbnail for ${id}: HTTP ${res.status}`);
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  console.log(`thumbnail saved: ${target}`);
}
