import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './index';

async function main() {
  console.log('Running migrations...');
  // Укажите путь к папке с миграциями, которую генерирует drizzle-kit
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed!');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
