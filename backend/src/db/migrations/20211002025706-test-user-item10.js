const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(8, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c92f54712a4100cd880b"),
      stockcount: 1,
      reminder: false,
      isDisabled: false,
      category: "CHIPS",
      name: "DORITOS NACHOS",
      quantity: 44,
      units: "gms",
      price: 30,
      notify: "request",
      description: "Sweet Chilli Flavor",
      nextreqdate: nextreqdate,
      totalstock: {
        daysleft: 8,
        amount: 44,
        units: "gms",
      },
      owner: ObjectId("615751116741384c1cb66522"),
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c92f54712a4100cd880b") });
  },
};
