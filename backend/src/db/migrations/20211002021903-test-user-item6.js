const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().add(13, "days").format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157c1ed7cf2f7563c52fff2"),
      stockcount: 5,
      reminder: false,
      isDisabled: false,
      category: "VEGETABLES",
      name: "SPRING ONIONS",
      quantity: 100,
      units: "gms",
      price: 12,
      notify: "request",
      description: "Spring Onions from local vendor",
      nextreqdate: nextreqdate,
      totalstock: {
        daysleft: 13,
        amount: 500,
        units: "gms",
      },
      owner: ObjectId("615751116741384c1cb66522"),
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157c1ed7cf2f7563c52fff2") });
  },
};
