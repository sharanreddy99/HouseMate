// Third Party Packages
const moment = require("moment");
const CronJob = require("cron").CronJob;

// Custom Packages
const dbutils = require("npm-atom/db/utils");
const logger = require("npm-atom/logger");
const constants = require("npm-atom/constants");
const emailutils = require("npm-atom/email/utils");
const crypt = require("npm-atom/crypt");

// Models
const Item = require("../models/items");
const Reminder = require("../models/reminder");

// Functions
async function fetchAllReminders() {
  var date = moment().format("YYYY-MM-DD");
  var hours = parseInt(moment().format("HH"));
  var minutes = parseInt(moment().format("mm"));

  const remindersAll = await dbutils.find(Reminder, {
    remtype: "reminderonly",
    nextreqdate: date,
    nextreqtime: { hours, minutes },
  });
  return remindersAll;
}

async function updateReminders(reminder) {
  reminder.isDisplayed = true;
  await reminder.save();

  var title = reminder.title;
  if (reminder.description && reminder.description.length > 0) {
    title = title + " | " + reminder.description;
  }

  var daysgap = reminder.daysgap;
  var customdays = reminder.customdays;
  var timegap = reminder.timegap;
  var customtime = reminder.customtime;

  var nextreqdate = reminder.nextreqdate;
  var nextreqtime = reminder.nextreqtime;

  if (daysgap != undefined && daysgap >= 0) {
    if (daysgap == 0) {
      //If days gap is 0
      if (timegap.hours == 0 && timegap.minutes == 0) {
        //customtime is present
        nextreqtime = customtime.find(function (time) {
          return (
            (time.hours >= nextreqtime.hours &&
              time.minutes > nextreqtime.minutes) ||
            time.hours > nextreqtime.hours
          );
        });

        if (!nextreqtime) {
          nextreqdate = moment().add(1, "days").format("YYYY-MM-DD");
          nextreqtime = {};
          nextreqtime.hours = customtime[0].hours;
          nextreqtime.minutes = customtime[0].minutes;
        }
      } else {
        //if time interval is present

        temp = moment(
          nextreqdate + "-" + nextreqtime.hours + "-" + nextreqtime.minutes,
          "YYYY-MM-DD-HH-mm"
        )
          .add(timegap.hours, "hours")
          .add(timegap.minutes, "minutes");
        nextreqdate = temp.format("YYYY-MM-DD");
        nextreqtime = {};
        nextreqtime.hours = temp.format("HH");
        nextreqtime.minutes = temp.format("mm");
      }
    } else {
      //if days gap is greater than 0
      if (timegap.hours == 0 && timegap.minutes == 0) {
        nextreqtime = customtime.find(function (time) {
          return (
            (time.hours >= nextreqtime.hours &&
              time.minutes > nextreqtime.minutes) ||
            time.hours > nextreqtime.hours
          );
        });

        if (!nextreqtime) {
          nextreqdate = moment(nextreqdate)
            .add(daysgap, "days")
            .format("YYYY-MM-DD");
          //always choose the first time
          nextreqtime = {};
          nextreqtime.hours = customtime[0].hours;
          nextreqtime.minutes = customtime[0].minutes;
        }
      } else {
        //choose the specified time interval adding it to current time
        temp = moment(
          nextreqdate + "-" + nextreqtime.hours + "-" + nextreqtime.minutes,
          "YYYY-MM-DD-HH-mm"
        )
          .add(timegap.hours, "hours")
          .add(timegap.minutes, "minutes");
        nextreqdate = temp.format("YYYY-MM-DD");
        nextreqtime = {};
        nextreqtime.hours = temp.format("HH");
        nextreqtime.minutes = temp.format("mm");
      }
    }
  } else {
    //custom days are available

    if (timegap.hours == 0 && timegap.minutes == 0) {
      //if custom date and time available
      if (nextreqdate == moment().format("YYYY-MM-DD")) {
        nextreqtime = customtime.find(function (time) {
          return (
            (time.hours >= moment().format("hh") &&
              time.minutes > moment().format("mm")) ||
            time.hours > moment().format("hh")
          );
        });
      } else {
        nextreqtime = customtime[0];
      }

      if (!nextreqtime) {
        //custom date available but custom time is past search for next custom date
        nextreqdate = customdays.find((date) => {
          return date.substring(5) > moment().format("MM-DD");
        });

        if (!nextreqdate) {
          //after searching if custom date not available goto next year
          nextreqdate =
            moment().add(1, "years").format("YYYY") +
            customdays[0].substring(4);
          if (timegap.hours == 0 && timegap.minutes == 0) {
            //custom time available choose first one
            nextreqtime = {};
            nextreqtime.hours = customtime[0].hours;
            nextreqtime.minutes = customtime[0].minutes;
          } else {
            //time interval present add it to 12:00am
            temp = moment(nextreqdate)
              .add(timegap.hours, "hours")
              .add(timegap.minutes, "minutes");
            nextreqtime = {};
            nextreqtime.hours = temp.format("HH");
            nextreqtime.minutes = temp.format("mm");
          }
        } else {
          //after searching custom date available
          if (timegap.hours == 0 && timegap.minutes == 0) {
            //custom time available choose first one
            nextreqtime = {};
            nextreqtime.hours = customtime[0].hours;
            nextreqtime.minutes = customtime[0].minutes;
          } else {
            //time interval present add it to 12:00am
            temp = moment(nextreqdate)
              .add(timegap.hours, "hours")
              .add(timegap.minutes, "minutes");
            nextreqtime = {};
            nextreqtime.hours = temp.format("HH");
            nextreqtime.minutes = temp.format("mm");
          }
        }
      }
    } else {
      if (nextreqdate == moment().format("YYYY-MM-DD")) {
        var temp = moment(
          nextreqdate +
            "-" +
            moment().format("HH") +
            "-" +
            moment().format("mm"),
          "YYYY-MM-DD-HH-mm"
        )
          .add(timegap.hours, "hours")
          .add(timegap.minutes, "minutes");
        if (nextreqdate != temp.format("YYYY-MM-DD")) {
          nextreqdate = customdays.find((date) => {
            return date.substring(5) >= temp.format("MM-DD");
          });

          if (!nextreqdate) {
            nextreqdate =
              moment().add(1, "years").format("YYYY") +
              customdays[0].substring(4);
          }

          nextreqtime = {};
          nextreqtime.hours = parseInt(timegap.hours);
          nextreqtime.minutes = parseInt(timegap.minutes);
        } else {
          nextreqtime = {};
          nextreqtime.hours = parseInt(temp.format("HH"));
          nextreqtime.minutes = parseInt(temp.format("mm"));
        }
      } else {
        var temp = moment(nextreqdate)
          .add(timegap.hours, "hours")
          .add(timegap.minutes, "minutes");
        nextreqtime = {};
        nextreqtime.hours = parseInt(temp.format("HH"));
        nextreqtime.minutes = parseInt(temp.format("mm"));
      }
    }
  }

  nextreqtimestring = {};

  if (("" + nextreqtime.hours).length == 1) {
    nextreqtimestring.hours = "0" + nextreqtime.hours;
  } else {
    nextreqtimestring.hours = nextreqtime.hours;
  }

  if (("" + nextreqtime.minutes).length == 1) {
    nextreqtimestring.minutes = "0" + nextreqtime.minutes;
  } else {
    nextreqtimestring.minutes = nextreqtime.minutes;
  }

  await dbutils.insert(Reminder, {
    newtitle:
      title +
      " | " +
      nextreqdate +
      " " +
      nextreqtimestring.hours +
      ":" +
      nextreqtimestring.minutes,
    title: reminder.title,
    description: reminder.description,
    priority: reminder.priority,
    daysgap: reminder.daysgap,
    customdays: reminder.customdays,
    timegap: reminder.timegap,
    customtime: reminder.customtime,
    nextreqdate,
    nextreqtime,
    isDisplayed: false,
    owner: reminder.owner,
  });
}

//once a day at 12:05am
var autoComputeItemRule = new CronJob(
  "0 5 12 1/1 * *",
  async function () {
    const unchangedAllItems = await dbutils.find(Item, {
      isDisabled: true,
      notify: "auto",
    });

    for (let i = 0; i < unchangedAllItems.length; i++) {
      unchangedAllItems[i].nextreqdate = moment(
        unchangedAllItems[i].nextreqdate
      )
        .add(1, "days")
        .format("YYYY-MM-DD");
      await unchangedAllItems[i].save();
    }

    const allItems = await dbutils.find(Item, {
      isDisabled: false,
      notify: "auto",
    });

    for (var i = 0; i < allItems.length; i++) {
      var item = allItems[i];

      var dailyamount = undefined;
      var units = undefined;
      if (item.utilizationUnits == "kg" || item.utilizationUnits == "lit") {
        dailyamount = (item.utilizationQuantity * 1000) / item.utilizationTime;
        units = item.utilizationUnits;
        if (item.utilizationUnits == "kg") units = "gms";
        if (item.utilizationUnits == "lit") units = "ml";
      } else {
        dailyamount = item.utilizationQuantity / item.utilizationTime;
        units = item.utilizationUnits;
      }

      item.totalstock.amount -= dailyamount;
      item.totalstock.amount = Math.round(item.totalstock.amount * 100) / 100;
      if (item.totalstock.amount < 0) {
        item.totalstock.amount = 0;
      }

      if (item.units == "kg" || item.units == "lit")
        item.stockcount = Math.ceil(
          item.totalstock.amount / (item.quantity * 1000)
        );
      else item.stockcount = Math.ceil(item.totalstock.amount / item.quantity);

      item.totalstock.daysleft -= 1;
      if (item.totalstock.daysleft < 0) item.totalstock.daysleft = 0;
      if (item.totalstock.daysleft == 0) item.reminder = true;
      else item.reminder = false;

      item.nextreqdate = moment()
        .add(item.totalstock.daysleft, "days")
        .format("YYYY-MM-DD");

      await item.save();
    }
  },
  null,
  true
);

//once a day at 12:10 am
var calculateRemindersForItemsRule = new CronJob(
  "0 10 12 1/1 * *",
  async function () {
    var date = moment().format("YYYY-MM-DD");

    const allItems = await dbutils.find(Item, { nextreqdate: { $lte: date } });
    for (var i = 0; i < allItems.length; i++) {
      await dbutils.deleteMany(Reminder, {
        owner: allItems[i].owner,
        title:
          allItems[i].category +
          " | " +
          allItems[i].name +
          " | " +
          allItems[i].quantity +
          allItems[i].units,
        remtype: "item",
      });
    }

    for (var i = 0; i < allItems.length; i++) {
      await dbutils.insert(Reminder, {
        newtitle:
          allItems[i].category +
          " | " +
          allItems[i].name +
          " | " +
          allItems[i].quantity +
          allItems[i].units +
          " | " +
          allItems[i].nextreqdate,
        title:
          allItems[i].category +
          " | " +
          allItems[i].name +
          " | " +
          allItems[i].quantity +
          allItems[i].units,
        description: allItems[i].description,
        priority: "high",
        daysgap: 0,
        customdays: [],
        timegap: [],
        customtime: [],
        nextreqdate: date,
        nextreqtime: {
          hours: 9,
          minutes: 0,
        },
        remtype: "item",
        isDisplayed: true,
        owner: allItems[i].owner,
      });
    }
  },
  null,
  true
);

//every minute
var calculateAndUpdateRemindersRule = new CronJob(
  "0 0/1 * 1/1 * *",
  async function () {
    const remindersAll = await fetchAllReminders();
    for (var i = 0; i < remindersAll.length; i++) {
      try {
        await updateReminders(remindersAll[i]);
      } catch (e) {
        logger.LogMessage(
          null,
          constants.LOG_DEBUG,
          "Caculate And Update Reminders Rule: " + e.message
        );
      }
    }
  },
  null,
  true
);

//everyday at 12:15 am
var sendEmailReminderRule = new CronJob(
  "0 15 12 1/1 * *",
  async function () {
    const remindersAll = await dbutils.find(Reminder, {
      isDisplayed: true,
      priority: "high",
    });
    var emailtoreminder = {};

    for (var i = 0; i < remindersAll.length; i++) {
      await remindersAll[i].populate("owner").execPopulate();
      emailtoreminder["" + remindersAll[i].owner.email] = [];
    }

    for (var i = 0; i < remindersAll.length; i++) {
      emailtoreminder["" + remindersAll[i].owner.email].push(
        remindersAll[i].newtitle
      );
    }
    emails = Object.keys(emailtoreminder);

    for (var i = 0; i < emails.length; i++) {
      var toAddress = crypt.StringDecrypt(emails[i]);
      reminderlist = "";
      for (var j = 0; j < emailtoreminder["" + emails[i]].length; j++) {
        reminderlist +=
          j + 1 + ") " + emailtoreminder["" + emails[i]][j] + "<br/>";
      }

      let body = {
        email: toAddress,
        unqId: "d32441a7-5dcb-47db-af94-947b967fdf08",
        placeholders: { REMINDERS_LIST: reminderlist },
        subject: "Reminders List",
      };
      try {
        await emailutils.SendMail(body, null, null);
      } catch (e) {
        logger.LogMessage(
          null,
          constants.LOG_DEBUG("Sending Emails Reminders Rule: " + e.message)
        );
      }
    }
  },
  null,
  true
);
