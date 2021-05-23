
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.string('email').primary()
        table.string('name')
        table.boolean('name_updated').defaultTo(false)
        table.string('surname')
        table.boolean('surname_updated').defaultTo(false)
        table.date('birthday')
        table.boolean('birthday_updated').defaultTo(false)
        table.integer('phone')
        table.string('pesel')
        table.boolean('phone_updated').defaultTo(false)
        table.boolean('fresh').defaultTo(true)
        table.timestamps(false, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};
