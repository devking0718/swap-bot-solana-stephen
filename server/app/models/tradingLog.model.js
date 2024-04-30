module.exports = (sequelize, Sequelize) => {
    const TradingLog = sequelize.define("tradingLog", {
      logContent: {
        type: Sequelize.TEXT
      },
    });
  
    return TradingLog;
  };
  