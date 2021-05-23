
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.string('id').primary()
        table.string('name')
        table.string('surname')
        table.string('email').notNull()
        table.date('birthday')
        table.integer('phone')
        table.string('pesel')
        table.timestamps(false, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};
