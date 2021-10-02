const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(14, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c96f54712a4100cd8815"),
      stockcount: 2,
      reminder: false,
      isDisabled: false,
      category: "DRINKS",
      name: "MOUNTAIN DEW",
      quantity: 700,
      units: "ml",
      price: 45,
      notify: "auto",
      utilizationTime: 10,
      utilizationQuantity: 1,
      utilizationUnits: "lit",
      description: "Lemon Flavor",
      totalstock: {
        amount: 1400,
        units: "ml",
        daysleft: 14,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c96f54712a4100cd8815") });
  },
};
