const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(18, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157cdecd4a3cf3690d3d4d9"),
      stockcount: 1,
      reminder: false,
      isDisabled: false,
      category: "CHOCOLATE",
      name: "BOURNVILLE",
      quantity: 1,
      units: "units",
      price: 95,
      notify: "auto",
      utilizationTime: 18,
      utilizationQuantity: 1,
      utilizationUnits: "units",
      description: "Dark Chocolate",
      totalstock: {
        amount: 1,
        units: "units",
        daysleft: 18,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157cdecd4a3cf3690d3d4d9") });
  },
};
