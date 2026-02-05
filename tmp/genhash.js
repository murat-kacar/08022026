const bcrypt = require('bcryptjs');
const pw = process.argv[2] || 'Admin123!';
bcrypt.hash(pw, 10, (err, hash) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(hash);
});
