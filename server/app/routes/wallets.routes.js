const verifyToken = require("../middleware/index.js");

module.exports = app => {
  const walletController = require("../controllers/wallet.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/createWallet", verifyToken, walletController.createWallet);
  router.get("/walletLists", verifyToken, walletController.walletLists);
  router.post("/getBalance", verifyToken, walletController.getBalance);

  app.use('/wallets', router);
};
