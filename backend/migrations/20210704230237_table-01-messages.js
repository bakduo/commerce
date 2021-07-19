exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('mensajes', function (table) {
    table.increments();
    table.string('user');
    table.text('msg');
    table.string('tiempo');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('mensajes', (table) => {
    table.dropForeign('status');
  });
};
