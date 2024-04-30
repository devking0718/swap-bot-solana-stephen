module.exports = (sequelize, Sequelize) => {
    const Wallet = sequelize.define("wallet", {
      address: {
        type: Sequelize.STRING
      },
      privateKey: {
        type: Sequelize.TEXT
      },
      balance: {
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.INTEGER
      },
    });
  
    return Wallet;
  };
  