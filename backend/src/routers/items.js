// Third Party Packages
const express = require("express");
const moment = require("moment");
var fs = require("fs");

//Custom Packages
const itemMethods = require("../miscellaneous/itemMethods");
const auth = require("npm-atom/middleware").AuthMiddleware;
const dbutils = require("npm-atom/db/utils");
const constants = require("npm-atom/constants");
const utils = require("npm-atom/utils");
const logger = require("npm-atom/logger");

// Models
const Item = require("../models/items");
const Reminder = require("../models/reminder");

// Setup
const router = new express.Router();

// Routers
router.post("/item", auth, async (req, res) => {
  try {
    req.body.itemSettings.owner = req.user._id;
    const tempitem = await dbutils.findOne(Item, {
      owner: req.body.itemSettings.owner,
      name: req.body.itemSettings.name,
    });

    if (tempitem) {
      return utils.ServeBadRequestResponse(
        req,
        res,
        new Error(
          "An item with that specified name already exists. Please check and try again"
        )
      );
    }

    const item = new Item(req.body.itemSettings);
    item.isDisabled = req.body.isDisabled;

    if (item.notify == "request") {
      await itemMethods.onRequest(item);
    } else {
      await itemMethods.onAutomatic(item);
    }

    let reminderitem = await Item.findOne({
      owner: req.body.itemSettings.owner,
      category: req.body.itemSettings.category,
      name: req.body.itemSettings.name,
      nextreqdate: { $eq: moment().format("YYYY-MM-DD") },
    });

    if (reminderitem) {
      await dbutils.insert(Reminder, {
        newtitle:
          reminderitem.category +
          " | " +
          reminderitem.name +
          " | " +
          reminderitem.quantity +
          reminderitem.units +
          " | " +
          reminderitem.nextreqdate,
        title:
          reminderitem.category +
          " | " +
          reminderitem.name +
          " | " +
          reminderitem.quantity +
          reminderitem.units,
        description: reminderitem.description,
        priority: "high",
        daysgap: 0,
        customdays: [],
        timegap: [],
        customtime: [],
        nextreqdate: reminderitem.nextreqdate,
        nextreqtime: {
          hours: 9,
          minutes: 0,
        },
        remtype: "item",
        isDisplayed: true,
        owner: reminderitem.owner,
      });
    }

    utils.ServeResponse(req, res, 201, item);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(constants.ERROR_PREFIX + "add item" + constants.ERROR_SUFFIX)
    );
  }
});

router.patch("/item", auth, async (req, res) => {
  try {
    req.body.itemSettings.owner = req.user._id;

    if (
      req.body.oldItemSettings.category != req.body.oldItemSettings.category ||
      req.body.oldItemSettings.name != req.body.itemSettings.name
    ) {
      tempqueryitem = {
        category: req.body.itemSettings.category,
        name: req.body.itemSettings.name,
      };
      const tempitem = await dbutils.findOne(Item, tempqueryitem);
      if (tempitem) {
        return utils.ServeBadRequestResponse(
          req,
          res,
          new Error(
            "An item with the specified details already exists. Please check and try again"
          )
        );
      }
    }

    let item = await dbutils.findOne(Item, {
      owner: req.body.itemSettings.owner,
      category: req.body.oldItemSettings.category,
      name: req.body.oldItemSettings.name,
    });

    const reminder = await dbutils.findOne(Reminder, {
      owner: req.body.itemSettings.owner,
      title:
        item.category + " | " + item.name + " | " + item.quantity + item.units,
      remtype: "item",
    });

    keys = Object.keys(req.body.itemSettings);
    for (let i = 0; i < keys.length; i++) {
      item[keys[i]] = req.body.itemSettings[keys[i]];
    }

    if (item.notify == "request") {
      await itemMethods.onRequest(item);
    } else {
      await itemMethods.onAutomatic(item);
    }

    item = await dbutils.findOne(Item, {
      owner: req.body.itemSettings.owner,
      category: req.body.itemSettings.category,
      name: req.body.itemSettings.name,
    });
    if (reminder) {
      reminder.newtitle =
        item.category +
        " | " +
        item.name +
        " | " +
        item.quantity +
        item.units +
        " | " +
        item.nextreqdate;
      reminder.title =
        item.category + " | " + item.name + " | " + item.quantity + item.units;
      reminder.description = item.description;
      reminder.nextreqdate = item.nextreqdate;
      reminder.isDisplayed = true;
      reminder.remtype = "item";
      await reminder.save();
      if (reminder.nextreqdate > moment().format("YYYY-MM-DD"))
        await reminder.remove();
    } else {
      if (item.nextreqdate == moment().format("YYYY-MM-DD")) {
        await dbutils.insert(Reminder, {
          newtitle:
            item.category +
            " | " +
            item.name +
            " | " +
            item.quantity +
            item.units +
            " | " +
            item.nextreqdate,
          title:
            item.category +
            " | " +
            item.name +
            " | " +
            item.quantity +
            item.units,
          description: item.description,
          priority: "high",
          daysgap: 0,
          customdays: [],
          timegap: [],
          customtime: [],
          nextreqdate: item.nextreqdate,
          nextreqtime: {
            hours: 9,
            minutes: 0,
          },
          remtype: "item",
          isDisplayed: true,
          owner: item.owner,
        });
      }
    }
    utils.ServeResponse(req, res, 201, {
      category: item.category,
      name: item.name,
    });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(constants.ERROR_PREFIX + "update item" + constants.ERROR_SUFFIX)
    );
  }
});

router.post("/refill/item", auth, async (req, res) => {
  try {
    req.body.itemSettings.owner = req.user._id;
    const item = await dbutils.findOne(Item, {
      owner: req.body.itemSettings.owner,
      category: req.body.itemSettings.category,
      name: req.body.itemSettings.name,
    });

    if (item.notify == "request")
      await itemMethods.onUpdateAddRequest(
        req.body.newstockcount,
        req.body.newquantity,
        req.body.newunits,
        item
      );
    else
      await itemMethods.onUpdateAddAutomatic(
        req.body.newstockcount,
        req.body.newquantity,
        req.body.newunits,
        item
      );

    let reminderitem = await dbutils.findOne(Item, {
      owner: req.body.itemSettings.owner,
      category: req.body.itemSettings.category,
      name: req.body.itemSettings.name,
      quantity: req.body.itemSettings.quantity,
      units: req.body.itemSettings.units,
    });
    await dbutils.deleteMany(Reminder, {
      owner: req.body.itemSettings.owner,
      title:
        reminderitem.category +
        " | " +
        reminderitem.name +
        " | " +
        reminderitem.quantity +
        reminderitem.units,
      remtype: "item",
    });

    if (reminderitem.nextreqdate == moment().format("YYYY-MM-DD")) {
      await dbutils.insert(Reminder, {
        newtitle:
          reminderitem.category +
          " | " +
          reminderitem.name +
          " | " +
          reminderitem.quantity +
          reminderitem.units +
          " | " +
          reminderitem.nextreqdate,
        title:
          reminderitem.category +
          " | " +
          reminderitem.name +
          " | " +
          reminderitem.quantity +
          reminderitem.units,
        description: reminderitem.description,
        priority: "high",
        daysgap: 0,
        customdays: [],
        timegap: [],
        customtime: [],
        nextreqdate: reminderitem.nextreqdate,
        nextreqtime: {
          hours: 9,
          minutes: 0,
        },
        remtype: "item",
        isDisplayed: true,
        owner: reminderitem.owner,
      });
    }
    utils.ServeResponse(
      req,
      res,
      201,
      "The stock from the item has been refilled successfully."
    );
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "refill the item's stock" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.post("/remove/item", auth, async (req, res) => {
  try {
    req.body.itemSettings.owner = req.user._id;
    const item = await dbutils.findOne(Item, {
      owner: req.body.itemSettings.owner,
      category: req.body.itemSettings.category,
      name: req.body.itemSettings.name,
    });

    if (item.notify == "request")
      await itemMethods.onUpdateRemoveRequest(
        req.body.newstockcount,
        req.body.newquantity,
        req.body.newunits,
        item
      );
    else
      await itemMethods.onUpdateRemoveAutomatic(
        req.body.newstockcount,
        req.body.newquantity,
        req.body.newunits,
        item
      );

    let reminderitem = await dbutils.findOne(Item, {
      owner: req.body.itemSettings.owner,
      category: req.body.itemSettings.category,
      name: req.body.itemSettings.name,
      nextreqdate: moment().format("YYYY-MM-DD"),
    });
    if (reminderitem) {
      let reminder = new Reminder({
        newtitle:
          reminderitem.category +
          " | " +
          reminderitem.name +
          " | " +
          reminderitem.quantity +
          reminderitem.units +
          " | " +
          reminderitem.nextreqdate,
        title:
          reminderitem.category +
          " | " +
          reminderitem.name +
          " | " +
          reminderitem.quantity +
          reminderitem.units,
        description: reminderitem.description,
        priority: "high",
        daysgap: 0,
        customdays: [],
        timegap: [],
        customtime: [],
        nextreqdate: reminderitem.nextreqdate,
        nextreqtime: {
          hours: 9,
          minutes: 0,
        },
        remtype: "item",
        isDisplayed: true,
        owner: req.body.itemSettings.owner,
      });
      await dbutils.deleteOne(Reminder, {
        owner: req.body.itemSettings.owner,
        title:
          reminderitem.category +
          " | " +
          reminderitem.name +
          " | " +
          reminderitem.quantity +
          reminderitem.units,
        remtype: "item",
      });
      await reminder.save();
    }

    utils.ServeResponse(
      req,
      res,
      201,
      "The stock from the item has been removed successfully."
    );
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "remove stock from item" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.post("/delete", auth, async (req, res) => {
  try {
    req.body.itemSettings.owner = req.user._id;
    const item = await dbutils.findOne(Item, {
      category: req.body.itemSettings.category,
      name: req.body.itemSettings.name,
      owner: req.body.itemSettings.owner,
    });

    await dbutils.deleteMany(Reminder, {
      owner: req.body.itemSettings.owner,
      newtitle:
        item.category +
        " | " +
        item.name +
        " | " +
        item.quantity +
        item.units +
        " | " +
        item.nextreqdate,
      remtype: "item",
    });

    await item.remove();
    utils.ServeResponse(req, res, 201, "Item has been deleted successfully");
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(constants.ERROR_PREFIX + "delete item" + constants.ERROR_SUFFIX)
    );
  }
});

router.get("/categories", auth, async (req, res) => {
  try {
    let owner = req.user._id;
    let category = await dbutils.find(Item, { owner: owner }, { category: 1 });

    let tempcategory = {};

    for (let i = 0; i < category.length; i++) {
      tempcategory[category[i].category] = category[i];
    }

    let i = 0;
    let newcategory = [];

    for (const itemind in tempcategory) {
      newcategory[i] = {};
      newcategory[i].id = i + 1;
      newcategory[i].text = tempcategory[itemind].category;
      i += 1;
    }

    utils.ServeResponse(req, res, 200, newcategory);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX + "fetch categories" + constants.ERROR_SUFFIX
      )
    );
  }
});

router.get("/item", auth, async (req, res) => {
  try {
    let owner = req.user._id;

    let item = await dbutils.find(
      Item,
      { owner: owner, category: req.query.category },
      { name: 1 }
    );
    let newitem = [];
    for (let i = 0; i < item.length; i++) {
      newitem[i] = {};
      newitem[i].id = i + 1;
      newitem[i].text = item[i].name;
    }
    utils.ServeResponse(req, res, 200, newitem);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "fetch items for given Category (" +
          req.query.category +
          ")" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.get("/details", auth, async (req, res) => {
  try {
    let owner = req.user._id;
    var item = await dbutils.findOne(Item, {
      owner: owner,
      category: req.query.category,
      name: req.query.name,
    });
    utils.ServeResponse(req, res, 200, item);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "fetch details for Item (" +
          req.query.item +
          ") from Category (" +
          req.query.category +
          ")" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.get("/disabled", auth, async (req, res) => {
  try {
    let owner = req.user._id;
    const item = await dbutils.findOne(Item, { owner: owner });
    let flag = false;
    if (item) {
      flag = item.isDisabled;
    }
    utils.ServeResponse(req, res, 200, { checked: flag });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "check status of the item" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.post("/disabled", auth, async (req, res) => {
  try {
    req.body.owner = req.user._id;
    let allItems = await dbutils.find(Item, { owner: req.body.owner });
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].isDisabled = req.body.isDisabled;
      await allItems[i].save();
    }

    utils.ServeResponse(req, res, 201, "status set to " + req.body.isDisabled);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "set the status of the item" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.get("/estimatedstock", auth, async (req, res) => {
  try {
    let owner = req.user._id;
    let reqdurationdate = moment();
    if (req.query.duration) {
      reqdurationdate = reqdurationdate
        .add(req.query.duration, "days")
        .format("YYYY-MM-DD");
    } else if (req.query.dateduration) {
      reqdurationdate = moment(req.query.dateduration).format("YYYY-MM-DD");
    }

    const allItems = await dbutils.find(Item, {
      owner: owner,
      nextreqdate: { $lte: reqdurationdate },
    });

    let estimatedstock = [];
    for (let i = 0; i < allItems.length; i++) {
      estimatedstock[i] = {};
      estimatedstock[i].id = i;
      estimatedstock[i].text = allItems[i].name;
    }

    utils.ServeResponse(req, res, 201, { estimatedstock });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "get estimated stock for summary" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.get("/estimatedstock/complete", auth, async (req, res) => {
  try {
    let owner = req.user._id;
    let reqdurationdate = moment();
    if (req.query.duration) {
      reqdurationdate = reqdurationdate
        .add(req.query.duration, "days")
        .format("YYYY-MM-DD");
    } else if (req.query.dateduration) {
      reqdurationdate = moment(req.query.dateduration).format("YYYY-MM-DD");
    }

    const allItems = await dbutils.find(Item, {
      owner: owner,
      nextreqdate: { $lte: reqdurationdate },
    });

    let estimatedstock = [];
    for (let i = 0; i < allItems.length; i++) {
      estimatedstock[i] = {};
      estimatedstock[i].id = i;
      estimatedstock[i].text = allItems[i].name;
      estimatedstock[i].category = allItems[i].category;
      estimatedstock[i].name = estimatedstock[i].text;
      estimatedstock[i].nextreqdate = allItems[i].nextreqdate;
      estimatedstock[i].currentstockcount = allItems[i].stockcount;
      if (allItems[i].notify == "auto") {
        estimatedstock[i].newstockcount = await itemMethods.getNewStockCount(
          allItems[i],
          reqdurationdate
        );
        estimatedstock[i].price =
          estimatedstock[i].newstockcount * allItems[i].price;
      } else {
        estimatedstock[i].newstockcount = "On Request";
        estimatedstock[i].price = undefined;
      }
    }

    utils.ServeResponse(req, res, 201, { estimatedstock });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "fetch complete details of estimated stock" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    let owner = req.user._id;
    let category = await dbutils.find(Item, { owner: owner }, { category: 1 });

    let tempcategory = {};

    for (let i = 0; i < category.length; i++) {
      tempcategory[category[i].category] = category[i];
    }

    let i = 0;
    let newcategory = [];

    for (const itemind in tempcategory) {
      newcategory[i] = {};
      newcategory[i].id = i + 1;
      newcategory[i].text = tempcategory[itemind].category;
      i += 1;
    }

    const allItems = await dbutils.find(
      Item,
      { owner: owner },
      { category: 1, name: 1, stockcount: 1, nextreqdate: 1 }
    );

    let estimatedstock = [];
    for (let i = 0; i < allItems.length; i++) {
      estimatedstock[i] = {};
      estimatedstock[i].category = allItems[i].category;
      estimatedstock[i].name = allItems[i].name;
      estimatedstock[i].stockcount = allItems[i].stockcount;
      estimatedstock[i].nextreqdate = allItems[i].nextreqdate;
    }

    utils.ServeResponse(req, res, 201, {
      selectdata: newcategory,
      estimatedstock,
    });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "fetch all items for a given user" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

router.get("/summary/all", auth, async (req, res) => {
  try {
    let owner = req.user._id;
    const estimatedstock = await Item.find(
      { owner: owner, category: req.query.category },
      { category: 1, name: 1, stockcount: 1, nextreqdate: 1 }
    );

    utils.ServeResponse(req, res, 201, { estimatedstock });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(
        constants.ERROR_PREFIX +
          "fetch all items for summary" +
          constants.ERROR_SUFFIX
      )
    );
  }
});

module.exports = router;
