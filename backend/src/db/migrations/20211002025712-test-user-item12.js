const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(15, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c9c954712a4100cd8820"),
      stockcount: 2,
      reminder: false,
      isDisabled: false,
      category: "DRINKS",
      name: "HERSHEYS MILK SHAKE",
      quantity: 450,
      units: "ml",
      price: 35,
      notify: "request",
      description: "Chocolate Flavor",
      nextreqdate: nextreqdate,
      totalstock: {
        daysleft: 15,
        amount: 900,
        units: "ml",
      },
      owner: ObjectId("615751116741384c1cb66522"),
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c9c954712a4100cd8820") });
  },
};
