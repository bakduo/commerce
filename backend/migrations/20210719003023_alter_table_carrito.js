exports.up = function (knex) {
  return knex.schema.alterTable('carritos', (table) => {
    table
      .string('carrito_session')
      .notNullable()
      .comment('This is carrito fake session');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('carritos', (table) => {
    table.dropForeign('status');
  });
};
