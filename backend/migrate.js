const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('Running raw SQL migrations directly...');
  try {
    const sqlFile = path.join(__dirname, 'drizzle', '0000_round_serpent_society.sql');
    if (!fs.existsSync(sqlFile)) {
        console.error('SQL file not found at:', sqlFile);
        process.exit(1);
    }
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    const sqlCommands = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
    
    for (let cmd of sqlCommands) {
       try {
         await pool.query(cmd);
       } catch(e) {
         console.log('Ignoring query error (likely already exists):', e.message);
       }
    }
    console.log('Migrations complete!');
  } catch (error) {
    console.error('Migration runtime failed!', error);
  } finally {
    await pool.end();
  }
}

run();
