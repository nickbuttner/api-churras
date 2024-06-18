exports.up = function (knex) {
  return knex.schema.createTable("guests", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.integer("bbq_id");
    table.boolean("paid").default(false);
    table.boolean("with_beverage").default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("guests");
};
