const bcrypt = require('bcrypt');
const readline = require('readline');

const saltRounds = 10;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Introduce la contraseña a hashear: ', (password) => {
  if (!password) {
    console.error('No se introdujo ninguna contraseña.');
    rl.close();
    return;
  }

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error('Error al hashear la contraseña:', err);
    } else {
      console.log('\nContraseña hasheada con éxito!');
      console.log('Copia este hash y pégalo en tu archivo 03-seed-data.sql:');
      console.log(hash);
    }
    rl.close();
  });
});