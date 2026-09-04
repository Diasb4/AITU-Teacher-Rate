import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://eexyrygatojgxmwhfgka.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lW13Ralei8f_iIQs2FRdzA_CDwYz5eN';

console.log('🚀 Connecting to Supabase project:', SUPABASE_URL);
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  const dataPath = join(__dirname, '../src/data/professors_rating.json');
  const profs = JSON.parse(readFileSync(dataPath, 'utf-8'));

  console.log(`Loaded ${profs.length} professors from ${dataPath}`);

  const rows = [];
  for (const p of profs) {
    for (const r of p.reviews || []) {
      const createdDate = r.date ? new Date(r.date) : new Date();
      const validDate = isNaN(createdDate.getTime()) ? new Date().toISOString() : createdDate.toISOString();

      rows.push({
        id: r.id,
        professor_id: p.id,
        author: r.author || 'Студент AITU',
        rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
        proctoring: Math.min(5, Math.max(1, Number(r.proctoring) || Number(p.proctoring_rating) || 3)),
        discipline: r.discipline || (p.disciplines && p.disciplines[0]) || 'Общий курс',
        grade: r.grade || 'A',
        tags: Array.isArray(r.tags) ? r.tags : [],
        text: (r.text || 'Отзыв студента').trim(),
        likes: Number(r.likes) || 1,
        created_at: validDate
      });
    }
  }

  console.log(`Total reviews to insert: ${rows.length}`);

  // Insert in batches of 100
  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await client.from('reviews').upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error in batch ${i} - ${i + batch.length}:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`\r✅ Progress: ${inserted} / ${rows.length} reviews inserted...`);
    }
  }

  console.log('\n\n🎉 Seeding completed!');

  // Verify final count
  const { count, error: countErr } = await client.from('reviews').select('*', { count: 'exact', head: true });
  if (!countErr) {
    console.log(`📊 Current total rows in Supabase "reviews" table: ${count}`);
  }
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
