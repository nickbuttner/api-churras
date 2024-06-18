exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("bbqs")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("bbqs").insert([
        {
          name: "Fim de ano",
          date: new Date(),
          organizer_id: 1,
          suggested_value: 20.5,
          suggested_value_without_beverage: 15.0,
        },
      ]);
    });
};
