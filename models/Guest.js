const { Model } = require("objection");

class Guest extends Model {
  static tableName = "guests";
}

exports.Guest = Guest;
