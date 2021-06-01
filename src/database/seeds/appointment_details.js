
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('appointment_details').del()
    .then(function () {
      // Inserts seed entries
      return knex('appointment_details').insert([
        {id: 1, date: '1619892088', duration: 60, price: 65.99, notes: "notatki doktora 1", typeKey: "Rodzinna", serviceKey: 'ckpbuqouo0tb90c04mbe1dj6n'},
        {id: 2, date: '1619892088', duration: 90, price: 65.99, notes: "notatki doktora 2", typeKey: "Rodzinna", serviceKey: 'ckpbus6v41v260c62trcdnvfj'},
        {id: 3, date: '1619892088', duration: 45, price: 65.99, notes: "notatki doktora 3", typeKey: "Rodzinna", serviceKey: 'ckpbv24w01x3s0c62a9dh1pzq'}
      ]);
    });
};
