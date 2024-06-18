exports.up = function (knex) {
  return knex.schema.createTable("bbqs", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.date("date");
    table.integer("organizer_id");
    table.float("suggested_value");
    table.float("suggested_value_without_beverage");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bbqs");
};
