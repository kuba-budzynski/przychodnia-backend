
exports.up = function(knex) {
    return knex.schema.createTable('appointment', (table) => {
        table.increments('id').primary()
        table.integer('patient').references('id').inTable('users');
        table.integer('details').references('id').inTable('appointment_details');
        table.string('doctorKey').notNull()
        table.date('date').notNull()
        table.boolean('isDone').defaultTo(false)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('appointment')
};
