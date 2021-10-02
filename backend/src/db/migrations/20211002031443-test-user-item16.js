const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(37, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157ce50d4a3cf3690d3d4f9"),
      stockcount: 1,
      reminder: false,
      isDisabled: false,
      category: "GROCERIES",
      name: "GROUND NUT OIL",
      quantity: 2.5,
      units: "lit",
      price: 180,
      notify: "auto",
      utilizationTime: 30,
      utilizationQuantity: 2,
      utilizationUnits: "lit",
      description: "",
      totalstock: {
        amount: 2500,
        units: "ml",
        daysleft: 37,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
      __v: 0,
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157ce50d4a3cf3690d3d4f9") });
  },
};
