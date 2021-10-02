const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(6, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157be3a7cf2f7563c52ff0e"),
      stockcount: 1,
      reminder: false,
      isDisabled: false,
      category: "FRUITS",
      name: "APPLES",
      quantity: 6,
      units: "units",
      price: 225,
      notify: "auto",
      utilizationTime: 1,
      utilizationQuantity: 1,
      utilizationUnits: "units",
      description: "Red Kashmiri Apples",
      totalstock: {
        amount: 6,
        units: "units",
        daysleft: 6,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157be3a7cf2f7563c52ff0e") });
  },
};
