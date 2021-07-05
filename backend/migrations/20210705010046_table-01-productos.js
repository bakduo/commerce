exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('productos', function (table) {
    table.increments();
    table.string('title');
    table.string('thumbail');
    table.float('price');
    table.integer('stock');
    table.integer('code');
    table.string('description');
    table.string('name');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('productos', (table) => {
    table.dropForeign('status');
  });
};
