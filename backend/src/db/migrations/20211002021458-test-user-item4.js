const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(18, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c06f7cf2f7563c52ff9b"),
      stockcount: 4,
      reminder: false,
      isDisabled: false,
      category: "VEGETABLES",
      name: "TOMATO",
      quantity: 0.5,
      units: "kg",
      price: 18,
      notify: "auto",
      utilizationTime: 7,
      utilizationQuantity: 750,
      utilizationUnits: "gms",
      totalstock: {
        amount: 2000,
        units: "gms",
        daysleft: 18,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
      description: "Organic Tomatoes",
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c06f7cf2f7563c52ff9b") });
  },
};
