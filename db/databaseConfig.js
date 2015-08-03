var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'blackbird',
    charset: 'utf8',
  }
});

knex.schema.hasTable('users').then(function (exists) {
  console.log('in hasTable callback', exists)
  if (!exists) {
    console.log('in not exists');
    knex.schema.createTable('users', function (user) {
      console.log('in createTable callback');
      user.increments('id').primary();
      user.string('first_name', 60);
      user.string('last_name', 60);
      user.string('email', 100);
      user.string('password', 100);
      user.timestamps();
    }).then(function(table) {
      console.log('Created Table', table);
    });
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;