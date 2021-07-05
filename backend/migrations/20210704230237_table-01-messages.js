exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('messages', function (table) {
    table.increments();
    table.string('user');
    table.text('msg');
    table.string('tiempo');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('messages', (table) => {
    table.dropForeign('status');
  });
};
