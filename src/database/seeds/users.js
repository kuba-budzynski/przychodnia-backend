const bcrypt = require('bcrypt')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'email1', password: bcrypt.hashSync('password1', 8)},
        {id: 2, email: 'email2', password: bcrypt.hashSync('password2', 8)},
        {id: 3, email: 'email3', password: bcrypt.hashSync('password3', 8)},
        {id: 4, email: 'email4', password: bcrypt.hashSync('password4', 8)},
        {id: 5, email: 'email5', password: bcrypt.hashSync('password5', 8)},
      ]);
    });
};
