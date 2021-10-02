const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(13, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c5c954712a4100cd8752"),
      stockcount: 2,
      reminder: false,
      isDisabled: false,
      category: "VEGETABLES",
      name: "POTATOES",
      quantity: 1,
      units: "kg",
      price: 90,
      notify: "request",
      description: "",
      nextreqdate: nextreqdate,
      totalstock: {
        daysleft: 13,
        amount: 2000,
        units: "gms",
      },
      owner: ObjectId("615751116741384c1cb66522"),
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c5c954712a4100cd8752") });
  },
};
