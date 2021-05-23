
exports.up = function(knex) {
    return knex.schema.createTable('users_login', (table) => {
        table.increments('id').primary()
        table.string('email').unique().notNull()
        table.boolean('email_Verified').notNull().defaultTo(false)
        table.string('password').notNull()
        table.timestamps(false, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users_login')
};
