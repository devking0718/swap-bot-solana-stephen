const verifyToken = require("../middleware/index.js");

module.exports = app => {
  const transactionController = require("../controllers/transaction.controller.js");

  var router = require("express").Router();

  router.get("/getTransactionList", verifyToken, transactionController.getTransactionList);

  app.use('/transactions', router);
};
