const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(12, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c6ff54712a4100cd8761"),
      stockcount: 3,
      reminder: false,
      isDisabled: false,
      category: "VEGETABLES",
      name: "SPINACH",
      quantity: 1,
      units: "kg",
      price: 30,
      notify: "auto",
      utilizationTime: 8,
      utilizationQuantity: 2,
      utilizationUnits: "kg",
      description: "",
      totalstock: {
        amount: 3000,
        units: "gms",
        daysleft: 12,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c6ff54712a4100cd8761") });
  },
};
