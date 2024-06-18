const { Model } = require("objection");
const { BBQ } = require("./BBQ");

class User extends Model {
  static tableName = "users";

  static relationMappings = {
    bbqs: {
      relation: Model.HasManyRelation,
      modelClass: BBQ,
      join: {
        from: "bbqs.organizer_id",
        to: "users.id",
      },
    },
  };
}

exports.User = User;
