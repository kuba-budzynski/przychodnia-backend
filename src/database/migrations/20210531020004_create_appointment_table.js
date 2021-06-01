
exports.up = function(knex) {
    return knex.schema.createTable('appointment', (table) => {
        table.increments('id').primary()
        table.string('patient').references('email').inTable('users');
        table.integer('details').unsigned().notNullable().references('id').inTable('appointment_details');
        table.string('doctorKey').notNull()
        table.timestamp('date').notNull()
        table.boolean('isDone').defaultTo(false)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('appointment')
};
