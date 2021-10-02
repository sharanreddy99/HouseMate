const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(28, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c8e354712a4100cd87ef"),
      stockcount: 8,
      reminder: false,
      isDisabled: false,
      category: "CHIPS",
      name: "LAYS",
      quantity: 20,
      units: "gms",
      price: 10,
      notify: "request",
      description: "Lay's Nashville Hot Chicken Flavor",
      nextreqdate: nextreqdate,
      totalstock: {
        daysleft: 28,
        amount: 160,
        units: "gms",
      },
      owner: ObjectId("615751116741384c1cb66522"),
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c8e354712a4100cd87ef") });
  },
};
