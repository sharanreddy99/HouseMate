const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(12, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157ce15d4a3cf3690d3d4ef"),
      stockcount: 1,
      reminder: false,
      isDisabled: false,
      category: "GROCERIES",
      name: "EGGS",
      quantity: 1,
      units: "dozen",
      price: 66,
      notify: "auto",
      utilizationTime: 12,
      utilizationQuantity: 1,
      utilizationUnits: "dozen",
      description: "Organic Eggs",
      totalstock: {
        amount: 1,
        units: "dozen",
        daysleft: 12,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157ce15d4a3cf3690d3d4ef") });
  },
};
