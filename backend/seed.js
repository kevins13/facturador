const db = require('./src/db');
const { users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'admin@auralink.com';
  const password = 'admin';

  const existingAdmins = await db.select().from(users).where(eq(users.email, email));

  if (existingAdmins.length > 0) {
    console.log('El administrador ya existe.');
    process.exit(0);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    email,
    password: hashedPassword,
  });

  console.log('Administrador creado exitosamente.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
