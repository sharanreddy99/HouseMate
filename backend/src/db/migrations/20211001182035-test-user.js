const ObjectId = require("mongodb").ObjectID;

module.exports = {
  async up(db, client) {
    await db.collection("users").insertOne({
      _id: ObjectId("615751116741384c1cb66522"),
      mobile: "----------",
      firstName: "sharan",
      lastName: "konda",
      displayName: "sharan konda",
      email: "3QCYadqysVi8JX4T++X3pvcHT3uc6a5aDSyYqe8pskodmjzpnYzUiw9aU3dCffFc",
      password: "$2b$06$FGpXYC5fSFKMgKZAue1G2eFY3.G14vrNV6VY7EkbRGRSdG8AjPLUi",
    });
  },

  async down(db, client) {
    await db
      .collection("users")
      .deleteOne({ _id: ObjectId("615751116741384c1cb66522") });
  },
};
