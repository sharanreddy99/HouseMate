const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

module.exports = {
  async up(db, client) {
    let nextreqdate = moment().format("YYYY-MM-DD");

    await db.collection("items").insertOne({
      _id: ObjectId("6157cda3d4a3cf3690d3d4a3"),
      stockcount: 0,
      reminder: true,
      isDisabled: false,
      category: "CHOCOLATE",
      name: "DOUBLEMINT",
      quantity: 1,
      units: "units",
      price: 50,
      notify: "auto",
      utilizationTime: 10,
      utilizationQuantity: 1,
      utilizationUnits: "units",
      description: "chewing gum",
      totalstock: {
        amount: 0,
        units: "units",
        daysleft: 0,
      },
      owner: ObjectId("615751116741384c1cb66522"),
      nextreqdate: nextreqdate,
    });

    await db.collection("reminders").insertOne({
      _id: ObjectId("6157db868068c33210651ed7"),
      priority: "high",
      customdays: [],
      remtype: "item",
      isDisplayed: true,
      newtitle: "CHOCOLATE | DOUBLEMINT | 1units | 2021-10-02",
      title: "CHOCOLATE | DOUBLEMINT | 1units",
      description: "chewing gum",
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
      .deleteOne({ _id: ObjectId("6157cda3d4a3cf3690d3d4a3") });

    await db
      .collection("reminders")
      .deleteOne({ _id: ObjectId("6157db868068c33210651ed7") });
  },
};
