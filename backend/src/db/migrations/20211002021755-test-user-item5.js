const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(4, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c13b7cf2f7563c52ffe6"),
      stockcount: 3,
      reminder: false,
      isDisabled: false,
      category: "VEGETABLES",
      name: "ONION",
      quantity: 500,
      units: "gms",
      price: 60,
      notify: "auto",
      utilizationTime: 4,
      utilizationQuantity: 1.25,
      utilizationUnits: "kg",
      description: "Onion",
      totalstock: {
        amount: 1500,
        units: "gms",
        daysleft: 4,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c13b7cf2f7563c52ffe6") });
  },
};
