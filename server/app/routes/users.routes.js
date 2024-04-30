const verifyToken = require("../middleware/index.js");

module.exports = app => {
    const userController = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/signUp", userController.signUp);
    router.post("/signIn", userController.signIn);
    router.post("/updatePassword", verifyToken, userController.updatePassword);
  
    app.use('/user', router);
  };
  