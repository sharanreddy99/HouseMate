const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(18, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157bf747cf2f7563c52ff1c"),
      stockcount: 3,
      reminder: false,
      isDisabled: false,
      category: "FRUITS",
      name: "BANANA",
      quantity: 1,
      units: "dozen",
      price: 40,
      notify: "auto",
      utilizationTime: 6,
      utilizationQuantity: 1,
      utilizationUnits: "dozen",
      description: "Yelakki bananas",
      totalstock: {
        amount: 3,
        units: "dozen",
        daysleft: 18,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157bf747cf2f7563c52ff1c") });
  },
};
