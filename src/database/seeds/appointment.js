
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('appointment').del()
    .then(function () {
      // Inserts seed entries
      return knex('appointment').insert([
        {id: 1, patient: 'pacjent123@yopmail.com', details:1, doctorKey:'ckohvo400gp540c51malwl5n0', date: '1619892088', isDone: true},
        {id: 2, patient: 'pacjent123@yopmail.com', details:2, doctorKey:'ckohvo400gp540c51malwl5n0', date: '1620842488', isDone: true},
        {id: 3, patient: 'pacjent123@yopmail.com', details:3, doctorKey:'ckosqk2a0z5yl0c57gi3xv88v', date:'1622052088', isDone: true}
      ]);
    });
};
