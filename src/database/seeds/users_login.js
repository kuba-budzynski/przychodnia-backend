const bcrypt = require('bcrypt')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users_login').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_login').insert([
        {id: 1, email: 'test1@gmail.com', password: bcrypt.hashSync('password1', 8), email_Verified: false},
        {id: 2, email: 'test2@gmail.com', password: bcrypt.hashSync('password2', 8), email_Verified: true},
        {id: 3, email: 'test3@gmail.com', password: bcrypt.hashSync('password3', 8), email_Verified: false},
        {id: 4, email: 'test4@gmail.com', password: bcrypt.hashSync('password4', 8), email_Verified: false},
        {id: 5, email: 'test5@gmail.com', password: bcrypt.hashSync('password5', 8), email_Verified: false},
      ]);
    });
};