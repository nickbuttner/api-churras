exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("guests")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("guests").insert([
        { name: "Paulo", bbq_id: 1 },
        { name: "Fabiana", bbq_id: 1 },
      ]);
    });
};
