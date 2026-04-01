// Simple script to generate bcrypt hash for admin password
// Run with: node scripts/generate-admin-hash.js

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('\n=== Bcrypt Password Hash ===');
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}\n`);
  console.log('Use this hash in your database migration or INSERT statement.\n');
  
  // Also show the SQL statement
  console.log('SQL Example:');
  console.log(`INSERT INTO users (email, name, password_hash, is_admin, created_at, updated_at)`);
  console.log(`VALUES ('admin@example.com', 'Admin User', '${hash}', TRUE, NOW(), NOW());`);
});
