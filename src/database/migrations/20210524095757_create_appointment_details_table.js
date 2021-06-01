exports.up = function(knex) {
    return knex.schema.createTable('appointment_details', (table) => {
        table.increments('id').primary()
        table.timestamp('date').notNull()
        table.integer('duration').notNull()
        table.float('price').notNull()
        table.string('notes')
        table.string('typeKey')
        table.string('serviceKey').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('appointment_details')
};
