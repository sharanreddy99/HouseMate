const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157d9cbcdbd213da0ce8137"),
      stockcount: 0,
      reminder: true,
      isDisabled: false,
      category: "FRUITS",
      name: "CHERRY",
      quantity: 1,
      units: "kg",
      price: 100,
      notify: "auto",
      utilizationTime: 2,
      utilizationQuantity: 500,
      utilizationUnits: "gms",
      totalstock: {
        amount: 0,
        units: "gms",
        daysleft: 0,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });

    await db.collection("reminders").insertOne({
      _id: ObjectId("6157d9cbcdbd213da0ce813a"),
      priority: "high",
      customdays: [],
      remtype: "item",
      isDisplayed: true,
      newtitle: "FRUITS | CHERRY | 1kg | 2021-10-02",
      title: "FRUITS | CHERRY | 1kg",
      daysgap: 0,
      customtime: [],
      nextreqdate: nextreqdate,
      nextreqtime: {
        hours: 9,
        minutes: 0,
      },
      owner: ObjectId("615751116741384c1cb66522"),
    });
  },

  async down(db, client) {
    await db
      .collection("items")
      .deleteOne({ _id: ObjectId("6157d9cbcdbd213da0ce8137") });

    await db
      .collection("reminders")
      .deleteOne({ _id: ObjectId("6157d9cbcdbd213da0ce813a") });
  },
};
