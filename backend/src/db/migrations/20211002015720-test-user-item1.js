const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(14, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157bc44104d4a4244c4a5c2"),
      stockcount: 2,
      reminder: false,
      isDisabled: false,
      category: "FRUITS",
      name: "ORANGES",
      quantity: 1,
      units: "kg",
      price: 25,
      notify: "auto",
      utilizationTime: 7,
      utilizationQuantity: 1,
      utilizationUnits: "kg",
      description: "Juicy Oranges",
      totalstock: {
        amount: 2000,
        units: "gms",
        daysleft: 14,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157bc44104d4a4244c4a5c2") });
  },
};
