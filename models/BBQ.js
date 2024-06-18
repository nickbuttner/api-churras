const { Model } = require("objection");
const { Guest } = require("./Guest");

class BBQ extends Model {
  static tableName = "bbqs";

  static relationMappings = {
    guests: {
      relation: Model.HasManyRelation,
      modelClass: Guest,
      join: {
        from: "guests.bbq_id",
        to: "bbqs.id",
      },
    },
  };
}

exports.BBQ = BBQ;
